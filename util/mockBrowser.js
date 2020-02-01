'use strict';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// 模拟浏览器环境
const mockBrowser = () => {
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
};

module.exports = mockBrowser;
