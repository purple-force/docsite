'use strict';

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');
const ora = require('ora');
const webpack = require('webpack');
const mockBrowser = require('../util/mockBrowser');
const generateJSONFile = require('./generateJSONFile.js');
const generateHTMLFile = require('./generateHTMLFile.js');

const CWD = process.cwd();

const build = () => {
  shell.cd(CWD);

  mockBrowser();
  generateJSONFile('prod', CWD);
  generateHTMLFile('prod', CWD);
  if (!fs.existsSync(path.join(CWD, 'docsite.config.js'))) {
    console.log(chalk.red('不在项目根目录！'));
    process.exit(0);
  }
  const customConfig = require(path.join(CWD, 'docsite.config.js'));
  const { rootPath } = customConfig;
  const webpackConfig = require('../util/getWebpackConfig')('production');
  webpackConfig.output.publicPath = `${rootPath}/build/`;
  const buildPath = path.join(webpackConfig.output.path, 'build');
  // 清空构建目录内容
  rimraf.sync(buildPath);
  const spinner = ora({
    text: '开始构建...',
    spinner: 'weather',
  }).start();
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    // error handling
    if (err) {
      console.log(chalk.red(err.stack || err));
      if (err.details) {
        console.log(chalk.red(err.details));
      }
      return;
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      console.log(chalk.red(info.errors));
    }
    if (stats.hasWarnings()) {
      console.log(chalk.yellow(info.warnings));
    }
  });
};

module.exports = build;
