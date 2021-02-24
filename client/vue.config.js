const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~styles/variables.scss"; @import "~styles/mixins.scss"; @import "~styles/functions.scss";`,
      },
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")],
      },
    },
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
      },
      "^/auth": {
        target: "http://localhost:5000",
      },
      "^/logout": {
        target: "http://localhost:5000",
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Quizdini";
      return args;
    });
    config.resolve.alias.set("styles", path.resolve(__dirname, "src/styles"));
  },
  outputDir: "../server/public",
};
