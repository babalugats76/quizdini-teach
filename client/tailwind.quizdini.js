const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  important: true,
  darkMode: false,
  corePlugins: ["fontFamily", "fontWeight", "margin", "padding", "preflight", "textTransform"],
  theme: {
    fontFamily: {
      montserrat: ["montserrat", "sans-serif"],
    },
    fontWeight: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      "semi-bold": 600,
      bold: 700,
      "extra-bold": 800,
      black: 900,
    },
    extend: {},
    screens: {
      ...defaultTheme.screens,
      xs: "0px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
  },
  variants: {},
  plugins: [],
};
