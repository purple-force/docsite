'use strict';

module.exports = {
  plugins: [
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-object-assign',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  env: {
    production: {
      plugins: ['lodash'],
    },
  },
};
