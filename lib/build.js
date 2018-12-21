'use strict';

const shell = require('shelljs');
const path = require('path');
const generateJSONFile = require('./generateJSONFile.js');
const generateHTMLFile = require('./generateHTMLFile.js');

const CWD = process.cwd();

const build = () => {
  shell.cd(CWD);

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
  global.window = window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;
  global.navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);
  generateJSONFile('prod', CWD);
  generateHTMLFile('prod', CWD);
  const platform = process.platform;
  if (platform === 'win32') {
    shell.exec(`node ${['node_modules', 'gulp', 'bin', 'gulp.js'].join(path.sep)} build`);
  } else {
    shell.exec(`${['node_modules', 'gulp', 'bin', 'gulp.js'].join(path.sep)} build`);
  }
};

module.exports = build;
