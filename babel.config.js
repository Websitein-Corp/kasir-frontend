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
  plugins: [
    "@babel/plugin-transform-private-methods",
    [
      "transform-es2015-template-literals",
      {
        loose: true,
        retainLines: true,
      },
    ],
    "transform-es2015-arrow-functions",
  ],
};
