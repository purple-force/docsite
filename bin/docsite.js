#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const program = require('commander');
const co = require('co');
const init = require('../lib/init');
const start = require('../lib/start');
const build = require('../lib/build');
const version = require('../package.json').version;

co(function* main() {
  program
    .version(version)
    .usage('<command> [options]')
    .option('init [project]', 'init project')
    .option('start', 'start a local server')
    .option('build', 'build assets')
    .parse(process.argv);
  const type = process.argv.slice(2)[0];
  switch (type) {
    case 'init': {
      const dir = process.argv.slice(2)[1];
      yield init(dir);
      break;
    }
    case 'start':
      start();
      break;
    case 'build':
      build();
      break;
    default:
      console.log(chalk.red(`please input ${chalk.green('docsite -h')} for help`));
  }
});
