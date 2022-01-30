const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line

module.exports = {
  purge: ["./src/**/*.{js,ts}", "./*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    minWidth: {
      96: "32rem"
    },
    screens: {
      xs: "480px",
      ...defaultTheme.screens
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
