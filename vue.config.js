const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["webpack-dev-server"],
  configureWebpack: {
    output: {
      globalObject: "this", // Ensures compatibility across environments\
      uniqueName: "kasir_frontend", // Ensure a unique name to avoid conflicts
    },
  },
});
