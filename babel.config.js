module.exports = {
  presets: [
    [
      "@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry", // Automatically include polyfills
        corejs: "3", // Use the latest version of core-js
        targets: {
          browsers: ["> 0.25%", "not dead", "Chrome 41"], // Specify older browser support
        },
      },
    ],
  ],
  plugins: [
    // Plugin to transform class properties and other modern syntax
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime", // For helper functions and async/await
  ],
};
