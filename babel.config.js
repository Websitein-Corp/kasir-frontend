module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry", // Automatically include polyfills based on usage
        corejs: "3", // Use the latest version of core-js
        targets: {
          browsers: ["> 0.25%", "not dead", "Chrome 41"], // Specify older browser support
        },
      },
    ],
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry", // Automatically include polyfills
        corejs: "3", // Use the latest version of core-js
      },
    ],
  ],
};
