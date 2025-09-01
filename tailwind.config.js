/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}', './global.css'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6daa0f',
        },
        gray: {
          50: '#f5f5f5',
          100: '#e7e7e7',
          200: '#e2e2e2',
          300: '#cecece',
          400: '#bababa',
          500: '#9d9d9d',
          600: '#808080',
          700: '#585858',
          800: '#313131',
          900: '#131313',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
    },
  },
  plugins: [],
};
