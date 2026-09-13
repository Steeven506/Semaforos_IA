/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a1a',
          800: '#1a1a2e',
          700: '#2d2d4a',
          600: '#3d3d5c'
        }
      }
    },
  },
  plugins: [],
}