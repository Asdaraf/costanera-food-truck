/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.{js,css}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'permanent-marker': ['"Permanent Marker"', 'cursive'],
        'righteous': ['Righteous', 'cursive'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      colors: {
        'custom-brown': '#C08B5C',
        'custom-brown-hover': '#a67a4f',
      },
    },
  },
  plugins: [],
} 