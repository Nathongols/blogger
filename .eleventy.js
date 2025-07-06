module.exports = async function(eleventyConfig) {
  const {EleventyRenderPlugin, EleventyI18nPlugin, EleventyHtmlBasePlugin} = await import("@11ty/eleventy");  
  const fs = require('fs');

  eleventyConfig.addFilter("markdownToTickets", function(markdownContent) {
    // Add a check for valid markdownContent
    if (typeof markdownContent !== 'string' || markdownContent.trim() === '') {
      return '';
    }

    const markdownIt = require("markdown-it")();
    
    // Remove front matter from the markdownContent
    const contentWithoutFrontMatter = markdownContent.replace(/---\n[\s\S]*?\n---/, '').trim();

    const paragraphs = contentWithoutFrontMatter.split(/\n\s*\n/); // Split by double newline for paragraphs

    const footerColors = ['bg-deep-teal', 'bg-mustard', 'bg-rust'];

    let ticketsHtml = '';
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim() === '') return; // Skip empty paragraphs

      const rotation = (Math.random() * 10) - 5; // Random rotation between -5 and 5 degrees
      const translateX = (Math.random() * 60) - 30; // Random X translation between -30 and 30px
      const translateY = (Math.random() * 60) - 30; // Random Y translation between -30 and 30px
      const zIndex = index + 1; // Sequential z-index: first ticket is 1, second is 2, etc.
      const randomFooterColor = footerColors[Math.floor(Math.random() * footerColors.length)];

      // Alternating left/right positioning for the single ticket
      const leftPosition = (index % 2 === 0) ? 5 : 45; // 5% for left, 45% for right
      const topPosition = (index * 25) + 10; // Increased vertical spacing with a base offset

      const ticketContent = markdownIt.render(paragraph);

      let innerContentClasses = "text-lg space-mono-regular text-dark-olive";
      let imageStyle = "";

      // Check if the content is primarily an image
      if (ticketContent.trim().startsWith('<p><img') && ticketContent.trim().endsWith('</p>')) {
        innerContentClasses = "flex items-center justify-center"; // Center image
        imageStyle = "max-width: 100%; max-height: 100%; object-fit: contain;"; // Make image responsive
      }

      ticketsHtml += `
        <div class="ticket absolute w-96 h-64 bg-white rounded-lg flex flex-col shadow-lg transition-all duration-200" 
             style="top: ${topPosition}%; left: ${leftPosition}%; transform: rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px); z-index: ${zIndex};">
          <div class="p-4 space-y-2 flex-grow ${innerContentClasses}">
            <div style="${imageStyle}">
              ${ticketContent}
            </div>
          </div>
          <div class="${randomFooterColor} h-12 rounded-b-lg"></div>
        </div>
      `;
    });
    return ticketsHtml;
  });

  // New filter to read file content
  eleventyConfig.addFilter("readFileContent", function(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.error(`Error reading file ${filePath}:`, e);
      return '';
    }
  });

  eleventyConfig.addPassthroughCopy("src/images");

  // Explicitly define the 'posts' collection
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "_site",
    },
  };
};