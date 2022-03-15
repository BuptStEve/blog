module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    'parser': 'babel-eslint',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: [
    'eslint:recommended',
  ],
  env: {
    node: true,
    browser: true,
  },
  rules: {
    quotes: [2, 'single'],
    indent: [2, 2],
  },
}
