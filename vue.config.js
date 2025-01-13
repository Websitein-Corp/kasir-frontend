const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: [/node_modules/],
  pwa: {
    name: process.env.VUE_APP_NAME,
    short_name: process.env.VUE_APP_NAME,
    description: "Online Cashier App",
    manifestOptions: {
      start_url: "/",
      background_color: "#ffffff",
    },
    display: "standalone",
    themeColor: "#4A90E2",
    faviconSVG: "img/icons/favicon.svg",
    favicon32: "img/icons/favicon-32x32.png",
    favicon16: "img/icons/favicon-16x16.png",
    appleTouchIcon: "img/icons/apple-touch-icon.png",
    maskIcon: null,
    msTileImage: null,
  },
});
