const presets = [
  [
    "@babel/env",
    {
      targets: {
        chrome: 73,
        safari: "12.1",
      },
      useBuiltIns: "usage",
      "corejs": 3
    },
  ],
];

module.exports = { presets };