module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    quotes: ["error", "double"],
    "no-console": "off",
    "no-var": "off",
    "no-unused-vars": "off",
    "require-jsdoc": "off",
  },
};
