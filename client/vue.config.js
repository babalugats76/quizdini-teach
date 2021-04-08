const path = require("path");

const webpack = require("webpack");

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~styles/style.scss";`,
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
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        global: "window", // Placeholder for global used in any node_modules
      }),
    ],
  },
};
