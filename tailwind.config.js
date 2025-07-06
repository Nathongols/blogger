// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{njk,md,html}",
    "./.eleventy.js",
  ],
  theme: {
    extend: {
      colors: {
        'olive-green': '#606c38',
        'dark-olive': '#283618',
        'cream': '#fefae0',
        'mustard': '#dda15e',
        'rust': '#bc6c25',
        'dusty-rose': '#C085A1',
        'deep-teal': '#1E4D50',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};