/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}', './global.css'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7EB658',
          light: '#9CCC7B',
        },
        sub: {
          100: '#64421A',
          200: '#F9B313',
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
        emoji: {
          best: '#A6EB7C',
          good: '#8FC3F6',
          soso: '#F3DE77',
          sad: '#585858',
          bad: '#585858',
          off: '#F5F5F5',
        },
        error: {
          DEFAULT: '#FF2E45',
        },
        success: {
          DEFAULT: '#1F66FF',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
    },
  },
  plugins: [],
};
