'use strict';

const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const ora = require('ora');
const inquirer = require('inquirer');

const questions = [
  {
    type: 'input',
    name: 'dir',
    default: '.',
    message: '项目初始化的根目录',
  },
];

const init = async (dir = '') => {
  if (!dir) {
    const answers = await inquirer.prompt(questions);
    dir = answers.dir;
  }
  dir = path.join(process.cwd(), dir);
  if (fs.existsSync(path.join(dir, 'docsite.config.js'))) {
    console.log(
      chalk.red(
        '项目已初始化过，如果想继续，请清空当前文件夹内容并重试！'
      )
    );
    return;
  }

  fs.copySync(path.join(__dirname, '../website'), dir);
  console.log(chalk.green('项目初始化成功！'));

  shell.cd(dir);
  const spinner = ora({
    text: '开始安装依赖...',
    spinner: 'weather',
  }).start();

  try {
    shell.exec('npm i', () => {
      spinner.stop();
    });
  } catch (err) {
    console.log(chalk.red('依赖安装失败，请执行 npm i 重试！'));
    process.exit(1);
  }
  console.log(chalk.green('恭喜，项目初始化成功'));
};

module.exports = init;
