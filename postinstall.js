'use strict';

const shelljs = require('shelljs');
const fs = require('fs-extra');
const path = require('path');

// 将收敛的依赖安装到初始化后的项目中
// 只在初始化后的项目中进行安装
// 部分为docsite使用，不需注入
const blackList = ['chalk', 'commander', 'fs-extra', 'inquirer',
  'ora', 'rimraf', 'shelljs', 'webpack-merge', 'asset-require-hook',
  'chokidar', 'css-modules-require-hook', 'ejs', 'highlight.js', 'inquirer',
  'jsdom', 'markdown-it', 'markdown-it-footnote', 'markdown-it-github-preamble',
  'markdown-it-katex', 'opencollective', 'opencollective-postinstall',
  'rimraf', 'webpack', 'webpack-dev-server',
];
if (fs.existsSync(path.join(process.cwd(), 'docsite.config.js'))) {
  const pkg = require('./package.json');
  shelljs.exec(`cd ${process.cwd()}`);
  const { dependencies } = pkg;
  const keys = Object.keys(dependencies);

  keys.filter(k => !blackList.includes(k)).forEach(k => {
    shelljs.exec(`npm i ${k}@${dependencies[k]}`);
  });
}

