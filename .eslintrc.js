module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    quotes: [2, 'single'],
  },
};
