/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...colors,
      brightYellow: '#EDFF1D',
      background: '#242424',
      backgroundDark: '#191919',
      fontGray: '#FBF4FC',
      fontGrayDark: '#5D5D5D',
    },
  },
  plugins: [],
};
