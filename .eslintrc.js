const isCI = require('is-ci') || Boolean(process.env.BUILD_URL)

const ERROR = 2

module.exports = {
  // parse proposal features like class fileds
  parser: '@babel/eslint-parser',

  // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  },

  // commonly used envs
  env: {
    browser: false,
    node: true,
    es6: true,
  },

  // we use recommended configurations
  extends: [
    // https://eslint.org/docs/rules/
    'eslint:recommended',
    // https://github.com/benmosher/eslint-plugin-import
    'plugin:import/recommended',
    // https://github.com/prettier/eslint-plugin-prettier
    !isCI && 'plugin:prettier/recommended',
    // https://github.com/prettier/eslint-config-prettier
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

  // TODO: 兼容现有仓库，随后考虑
  globals: {
    __DEV__: false,
  },
}
