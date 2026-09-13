/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a1a',
          800: '#1a1a2e',
          700: '#2d2d4a',
          600: '#3d3d5c'
        },
        light: {
          900: '#f8fafc',
          800: '#f1f5f9',
          700: '#e2e8f0',
          600: '#cbd5e1'
        }
      }
    },
  },
  plugins: [],
}