'use strict';

const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const chalk = require('chalk');
const ejs = require('ejs');
const fs = require('fs-extra');
const parseMd = require('./parseMd.js');

let siteConfig;
try {
  // 初始化时该文件还不存在
  siteConfig = require(path.join(process.cwd(), './site_config/site')).default;
} catch (err) {
  // do noting
}

const generate = (env, cwd, type, lang) => {
  if (env === 'dev') {
    window.rootPath = '';
  } else if (env === 'prod') {
    window.rootPath = siteConfig.rootPath;
  }
  const parse = dir => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      const extension = path.extname(file);
      if (stat.isFile() && (extension === '.md' || extension === '.markdown')) {
        const result = parseMd(filepath);
        // cwd/docs/zh-cn/hello.md => cwd/zh-cn/docs/hello.json
        const fileInfo = path.parse(filepath);
        const splitArr = fileInfo.dir.split(`${type}${path.sep}${lang}`);
        const targetPath = `${splitArr[0]}${lang}${path.sep}${type}${splitArr[1]}`;
        fs.ensureDirSync(targetPath);
        fs.writeFileSync(
          path.join(targetPath, `${fileInfo.name}.json`),
          JSON.stringify(
            Object.assign(
              {
                filename: file,
                __html: result.__html,
              },
              result.meta
            ),
            null,
            2
          ),
          'utf8'
        );
        // 同步生成HTML，避免再遍历一遍目录
        // 生成文档
        if (
          type === 'docs' &&
          fs.existsSync(path.join(cwd, './src/pages/documentation'))
        ) {
          const Documentation = require(path.join(cwd, './src/pages/documentation'))
            .default;
          ejs.renderFile(
            path.join(cwd, './template.ejs'),
            {
              title: result.meta.title || fileInfo.name,
              keywords: result.meta.keywords || fileInfo.name,
              description: result.meta.description || fileInfo.name,
              rootPath: window.rootPath,
              page: 'documentation',
              __html: ReactDOMServer.renderToString(
                React.createElement(Documentation, { lang, __html: result.__html }, null)
              ),
            },
            (err, str) => {
              if (err) {
                console.log(chalk.red(err));
                process.exit(1);
              }
              fs.writeFileSync(path.join(targetPath, `${fileInfo.name}.html`), str, 'utf8');
            }
          );
        } else if (
          type === 'blog' &&
          fs.existsSync(path.join(cwd, './src/pages/blogDetail'))
        ) {
          const BlogDetail = require(path.join(cwd, './src/pages/blogDetail')).default;
          ejs.renderFile(
            path.join(cwd, './template.ejs'),
            {
              title: result.meta.title || fileInfo.name,
              keywords: result.meta.keywords || fileInfo.name,
              description: result.meta.description || fileInfo.name,
              rootPath: window.rootPath,
              page: 'blogDetail',
              __html: ReactDOMServer.renderToString(
                React.createElement(BlogDetail, { lang, __html: result.__html }, null)
              ),
            },
            (err, str) => {
              if (err) {
                console.log(chalk.red(err));
                process.exit(1);
              }
              fs.writeFileSync(path.join(targetPath, `${fileInfo.name}.html`), str, 'utf8');
            }
          );
        }
      } else if (stat.isDirectory()) {
        parse(filepath);
      }
    });
  };
  parse(path.join(cwd, type, lang));
};
const generateJSONFile = (env, cwd) => {
  generate(env, cwd, 'docs', 'zh-cn');
  generate(env, cwd, 'docs', 'en-us');
  generate(env, cwd, 'blog', 'zh-cn');
  generate(env, cwd, 'blog', 'en-us');
};

module.exports = generateJSONFile;
