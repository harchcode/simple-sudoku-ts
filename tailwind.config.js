const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line

module.exports = {
  content: ["./src/**/*.{js,ts}", "./*.html"],
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
  plugins: []
};
