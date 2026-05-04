/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#EB1948',
        'primary-dark': '#002528',
        'primary-gray': '#212529',
        'primary-light': '#F5F5F5',
        blush: {
          50:  '#FFF8F6',
          100: '#FFF0EB',
          200: '#FDDDD4',
          300: '#F5C4B8',
          400: '#E8A899',
          500: '#D4897A',
        },
        warm: {
          50:  '#FFFAF7',
          100: '#FEF3EC',
          200: '#FDE8D8',
          300: '#F5D4BE',
          400: '#DEB89E',
          500: '#C49B80',
        },
        nude: {
          50:  '#FDFAF8',
          100: '#F9F1EC',
          200: '#F0E2D8',
          300: '#E2CEBF',
          400: '#C9AC97',
        },
      },
      fontFamily: {
        primary2: ['Montserrat', 'sans-serif'],
        primary:['Open Sans', 'sans-serif'],
        primary3: ['Roboto', 'sans-serif'],
      },

      animation: {
        'reveal': 'reveal 0.5s ease-out forwards',
      },
      keyframes: {
        reveal: {
          '0%': { 
            opacity: 0,
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
          },
          '100%': { 
            opacity: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
          }
        },
      },

    },
    plugins: [],
  }
};