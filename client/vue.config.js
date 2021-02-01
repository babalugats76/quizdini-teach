module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:5000",
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Quizdini";
      return args;
    });
  },

  outputDir: "../server/public",
};
