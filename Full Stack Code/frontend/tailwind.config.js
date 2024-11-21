/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-datepicker/**/*.js',
  ],
  theme: {
    extend: {
      fontSize:{
        '10xl':'100px'
      },
      colors: {
        'neon-purple': '#d946ef', // Custom color
      },
    },
  },
  plugins: [
    require('flowbite/plugin') // Add Flowbite plugin
  ],
};
