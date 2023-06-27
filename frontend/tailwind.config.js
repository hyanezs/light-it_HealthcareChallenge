/** @type {import('tailwindcss').Config} */
import colors from './src/config/colors'

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
    ...colors
    },
  },
  plugins: [],
};
