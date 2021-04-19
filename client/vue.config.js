const path = require("path");

const webpack = require("webpack");

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~styles/_config.scss"; @import "~styles/_mixins.scss"; @import "~styles/_functions.scss";`,
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
    config.resolve.alias.set("@api", path.resolve(__dirname, "src/api"));
    config.resolve.alias.set("@components", path.resolve(__dirname, "src/components"));
    config.resolve.alias.set("@hooks", path.resolve(__dirname, "src/compose"));
    config.resolve.alias.set("@mixins", path.resolve(__dirname, "src/components/mixins"));
    config.resolve.alias.set("@ui", path.resolve(__dirname, "src/components/ui"));
    config.resolve.alias.set("@utils", path.resolve(__dirname, "src/utils"));
    config.resolve.alias.set("@views", path.resolve(__dirname, "src/views"));
    config.resolve.alias.set("@vuex", path.resolve(__dirname, "src/store"));
  },
  outputDir: "../server/public", // places build in server (Express.js) directory
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        global: "window", // Placeholder for global used in any node_modules
      }),
    ],
  },
};
