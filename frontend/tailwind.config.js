/** @type {import('tailwindcss').Config} */
import defaultColors from 'tailwindcss/colors';
import colors from './src/config/colors'

delete defaultColors.lightBlue;
delete defaultColors.warmGray;
delete defaultColors.trueGray;
delete defaultColors.coolGray;
delete defaultColors.blueGray;

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...defaultColors,
    ...colors
    },
  },
  plugins: [],
};
