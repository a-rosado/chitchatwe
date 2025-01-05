module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Optional custom font
      },
    },
  },
  darkMode: 'class', // Enable dark mode by adding a class
  plugins: [],
};
