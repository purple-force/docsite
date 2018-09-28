'use strict';

const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');

const init = () => {
  if (fs.existsSync(path.join(process.cwd(), './.docsite'))) {
    console.log(
      chalk.red(
        'this project has been initialized, if you want to continue, please remove the .docsite file and try again'
      )
    );
    return;
  }
  fs.writeFileSync(path.join(process.cwd(), './.docsite'), '');

  fs.copySync(path.join(__dirname, '../website'), process.cwd());
  shell.cd(process.cwd());
  try {
    shell.exec('npm i');
  } catch (err) {
    console.log(chalk.red('dependencies install failed, please reinstall again!'));
    process.exit(1);
  }
  console.log(chalk.green('Congratulations, init succeed!'));
};

module.exports = init;
