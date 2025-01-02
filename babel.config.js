module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "41",
        },
        useBuiltIns: "usage", // Automatically includes required polyfills
        corejs: "3",
      },
    ],
  ],
};
