'use strict';

// Provide custom regenerator runtime and core-js
require('@babel/polyfill');

// Javascript required hook
require('@babel/register')({
  extensions: ['.es6', '.es', '.jsx', '.js'],
  cache: true,
});

// Css required hook
require('css-modules-require-hook')({
  extensions: ['.scss', '.css'],
  preprocessCss: (data, filename) =>
    require('node-sass').renderSync({
      data,
      file: filename,
    }).css,
  camelCase: true,
  generateScopedName: '[name]__[local]__[hash:base64:8]',
});

// Image required hook
require('asset-require-hook')({
  extensions: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  limit: 8000,
});

const shell = require('shelljs');
const path = require('path');
const cp = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const fs = require('fs');
const chalk = require('chalk');

const mockBrowser = require('../util/mockBrowser');
const generateJSONFile = require('./generateJSONFile.js');
const generateHTMLFile = require('./generateHTMLFile.js');

const CWD = process.cwd();

const start = () => {
  shell.cd(CWD);
  mockBrowser();
  generateJSONFile('dev', CWD);
  generateHTMLFile('dev', CWD);
  cp.fork(path.join(__dirname, './watch.js'));
  if (!fs.existsSync(path.join(CWD, './docsite.config.js'))) {
    console.log(chalk.red('不在项目根目录！'));
    process.exit(0);
  }
  const customConfig = require(path.join(CWD, 'docsite.config.js'));
  const { port = 8080 } = customConfig;
  const webpackConfig = require('../util/getWebpackConfig')('development');
  webpackConfig.output.publicPath = `http://127.0.0.1:${port}/build/`;
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, {
    watchContentBase: true,
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(chalk.green(`Listening at http://127.0.0.1:${port}`));
  });
};

module.exports = start;
