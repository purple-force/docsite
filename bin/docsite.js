#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
const init = require('../lib/init.js');
const start = require('../lib/start.js');
const build = require('../lib/build.js');
const version = require('../package.json').version;

program
  .version(version)
  .usage('<command> [options]')
  .option('init', 'init project')
  .option('start', 'start a local server')
  .option('build', 'build assets')
  .parse(process.argv);
const type = process.argv.slice(2)[0];
switch (type) {
  case 'init':
    init();
    break;
  case 'start':
    start();
    break;
  case 'build':
    build();
    break;
  default:
    console.log(chalk.red(`please input ${chalk.green('docsite -h')} for help`));
}
