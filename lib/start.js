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

const shell = require('shelljs');
// const chokidar = require('chokidar');
const path = require('path');
const cp = require('child_process');
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
window.requestAnimationFrame = (window.requestAnimationFrame) || (f => window.setTimeout(f, 1e3 / 60));
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener() {},
    removeListener() {},
  };
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

const start = () => {
  shell.cd(CWD);
  generateJSONFile('dev', CWD);
  generateHTMLFile('dev', CWD);
  cp.fork(path.join(__dirname, './watch.js'));
  const platform = process.platform;
  if (platform === 'win32') {
    shell.exec(`node ${['node_modules', 'gulp', 'bin', 'gulp.js'].join(path.sep)}`);
  } else {
    shell.exec(`${['node_modules', 'gulp', 'bin', 'gulp.js'].join(path.sep)}`);
  }
};

module.exports = start;
