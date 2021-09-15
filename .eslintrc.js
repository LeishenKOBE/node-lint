const isCI = require('is-ci') || Boolean(process.env.BUILD_URL)
const ERROR = 2

module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
  },
  env: {
    browser: false,
    node: true,
    es6: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    !isCI && 'plugin:prettier/recommended',
    'prettier',
  ].filter(Boolean),

  rules: {
    // recommended rules
    'prefer-const': ERROR,
    'no-var': ERROR,
    'no-console': ERROR,
    'no-use-before-define': ['error', 'nofunc'],
    'max-lines': [ERROR, {max: 500}],
    'max-lines-per-function': [ERROR, {max: 200}],
  },
}
