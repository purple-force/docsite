'use strict';

const path = require('path');
const coffee = require('coffee');
const assert = require('assert');

describe('test/docsite.test.js', () => {
  const myBin = require.resolve('../bin/docsite');
  const cwd = path.join(__dirname, 'docsite-project');

  describe('docsite --help', () => {
    it('docsite', function* () {
      const { stdout, code } = yield coffee
        .fork(myBin, [], { cwd })
        .end();
      assert(stdout.includes('docsite -h'));
      assert(code === 0);
    });

    it('docsite --help', function* () {
      const { stdout, code } = yield coffee
        .fork(myBin, ['--help'], { cwd })
        .end();
      assert(stdout.includes('Usage: docsite <command> [options]'));
      assert(code === 0);
    });
  });

  describe('docsite init', () => {
    it('docsite init', function* () {
      const { stdout, code } = yield coffee
        .fork(myBin, ['init', '.'], {
          cwd,
        })
        .end();
      assert(stdout.includes('Congratulations, init succeed!'));
      assert(code === 0);
    });

    it('docsite init failed: this project has been initialized', function* () {
      const { stdout, code } = yield coffee
        .fork(myBin, ['init'], {
          cwd,
        })
        // .waitForPrompt()
        .write('.\n')
        .end();
      assert(stdout.includes('This project has been initialized'));
      assert(code === 0);
    });
  });

  describe('docsite build', () => {
    it('docsite build', function* () {
      const { stdout, code } = yield coffee
        .fork(myBin, ['build'], { cwd })
        .end();
      assert(stdout.includes('Finished \'build\' after'));
      assert(code === 0);
    });
  });

  // // 务必放到最后，否则该子进程无法正常退出
  // describe('docsite start', () => {
  //   it('docsite start', function* (done) {
  //     const ps = coffee
  //       .spawn(myBin, ['start'], { cwd });
  //     setTimeout(() => {
  //       const { proc } = ps;
  //       proc.kill('SIGHUP');
  //       ps.end(done);
  //     }, 10000);
  //     yield ps
  //       .expect('stdout', 'webpack: Compiled successfully.');
  //   });
  // });
});
