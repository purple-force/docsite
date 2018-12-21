'use strict';

// Provide custom regenerator runtime and core-js
require('babel-polyfill');

// Javascript required hook
require('babel-register')({
  extensions: ['.es6', '.es', '.jsx', '.js'],
  presets: ['es2015', 'react', 'stage-0'],
  plugins: ['transform-decorators-legacy'],
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

const chokidar = require('chokidar');
const path = require('path');
const chalk = require('chalk');

// 模拟浏览器环境
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const dom = new JSDOM(
  '<!doctype html><html><body><head><link/><style></style><script></script></head><script></script></body></html>'
);
const { window } = dom;
const copyProps = (src, target) => {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
};
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

const generateJSONFile = require('./generateJSONFile.js');
const generateHTMLFile = require('./generateHTMLFile.js');

const CWD = process.cwd();
const mdWatcher = chokidar.watch([path.join(CWD, './docs'), path.join(CWD, './blog')], {
  ignoreInitial: true, // 默认为false，会在初始化时一直触发add和addDir事件
});
const ejsWatcher = chokidar.watch(
  [path.join(CWD, './template.ejs'), path.join(CWD, './redirect.ejs')],
  {
    ignoreInitial: true, // 默认为false，会在初始化时一直触发add和addDir事件
  }
);
// md文档监听
mdWatcher
  .on('add', filePath => {
    const extension = path.extname(filePath);
    if (extension === '.md' || extension === '.markdown') {
      console.log(chalk.green(`${filePath} was added`));
      generateJSONFile('dev', CWD);
      generateHTMLFile('dev', CWD);
    }
  })
  .on('change', filePath => {
    const extension = path.extname(filePath);
    if (extension === '.md' || extension === '.markdown') {
      console.log(chalk.green(`${filePath} was changed`));
      generateJSONFile('dev', CWD);
      generateHTMLFile('dev', CWD);
    }
  })
  .on('unlink', filePath => {
    const extension = path.extname(filePath);
    if (extension === '.md' || extension === '.markdown') {
      console.log(chalk.red(`${filePath} was deleted`));
      generateJSONFile('dev', CWD);
      generateHTMLFile('dev', CWD);
    }
  });
// 监听ejs的变化
ejsWatcher
  .on('add', filePath => {
    console.log(chalk.green(`${filePath} was added`));
    generateJSONFile('dev', CWD);
    generateHTMLFile('dev', CWD);
  })
  .on('change', filePath => {
    console.log(chalk.green(`${filePath} was changed`));
    generateJSONFile('dev', CWD);
    generateHTMLFile('dev', CWD);
  })
  .on('unlink', filePath => {
    console.log(chalk.red(`${filePath} was deleted`));
    generateJSONFile('dev', CWD);
    generateHTMLFile('dev', CWD);
  });
