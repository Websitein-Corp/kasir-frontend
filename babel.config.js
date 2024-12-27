module.exports = {
  // presets: ["@vue/cli-plugin-babel/preset"],
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3.22",
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-private-methods"],
};
