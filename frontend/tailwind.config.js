/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    theme: ['light']
  },
}

