module.exports = {
  presets: [require("./tailwind.quizdini.js")],
  /* must specify whole key - not deeply merged */
  purge: {
    //enabled: true,
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    options: {
      safelist: [],
    },
  },
};
