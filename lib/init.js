'use strict';

const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const questions = [
  {
    type: 'input',
    name: 'dir',
    default: '.',
    message: 'Which directory should the project initialized in?',
  },
];

const init = function* (dir = '') {
  if (!dir) {
    const answers = yield inquirer.prompt(questions);
    dir = answers.dir;
  }
  dir = path.join(process.cwd(), dir);
  if (fs.existsSync(path.join(dir, './.docsite'))) {
    console.log(
      chalk.red(
        'This project has been initialized, if you want to continue, please remove the .docsite file and try again'
      )
    );
    return;
  }
  // fs.writeFileSync(path.join(process.cwd(), './.docsite'), '');

  fs.copySync(path.join(__dirname, '../website'), dir);
  console.log(chalk.green('Project folder was created successfully.'));

  shell.cd(dir);
  try {
    shell.exec('npm i');
  } catch (err) {
    console.log(chalk.red('Dependencies install failed, please reinstall again!'));
    process.exit(1);
  }
  console.log(chalk.green('Congratulations, init succeed!'));
};

module.exports = init;
