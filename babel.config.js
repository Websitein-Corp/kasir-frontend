module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry", // Automatically include polyfills
        corejs: "3", // Use the latest version of core-js
      },
    ],
  ],
};
