'use strict';

const path = require('path');
const fs = require('fs-extra');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const chalk = require('chalk');
const ejs = require('ejs');

let siteConfig;
try {
  // 初始化时该文件还不存在
  siteConfig = require(path.join(process.cwd(), './site_config/site')).default;
} catch (err) {
  // do noting
}

const generateHTMLFile = (env, cwd) => {
  if (env === 'dev') {
    window.rootPath = '';
  } else if (env === 'prod') {
    window.rootPath = siteConfig.rootPath;
  }
  // 生成404.html、重定向页面（用于初始进入的语言跳转）
  if (fs.existsSync(path.join(cwd, './redirect.ejs'))) {
    ejs.renderFile(
      path.join(cwd, './redirect.ejs'),
      {
        defaultLanguage: siteConfig.defaultLanguage,
        rootPath: window.rootPath,
      },
      (err, str) => {
        if (err) {
          console.log(chalk.red(err));
          process.exit(1);
        }
        fs.writeFileSync(path.join(cwd, '404.html'), str, 'utf8');
        fs.writeFileSync(path.join(cwd, 'index.html'), str, 'utf8');
      }
    );
  }
  // 生成首页（home），直接放置在语言目录下
  if (fs.existsSync(path.join(cwd, './src/pages', 'home', './index.jsx'))) {
    // 导入用ES6 export default导出的模块
    const Page = require(path.join(cwd, './src/pages', 'home')).default;
    // 生成英文版
    fs.ensureDirSync(path.join(cwd, 'en-us'));
    ejs.renderFile(
      path.join(cwd, './template.ejs'),
      {
        title: 'home',
        keywords: 'home',
        description: 'home',
        rootPath: window.rootPath,
        page: 'home',
        __html: ReactDOMServer.renderToString(React.createElement(Page, { lang: 'en-us' }, null)),
      },
      (err, str) => {
        if (err) {
          console.log(chalk.red(err));
          process.exit(1);
        }
        fs.writeFileSync(path.join(cwd, 'en-us', 'index.html'), str, 'utf8');
      }
    );

    // 生成中文版
    fs.ensureDirSync(path.join(cwd, 'zh-cn'));
    ejs.renderFile(
      path.join(cwd, './template.ejs'),
      {
        title: 'home',
        keywords: 'home',
        description: 'home',
        rootPath: window.rootPath,
        page: 'home',
        __html: ReactDOMServer.renderToString(React.createElement(Page, { lang: 'zh-cn' }, null)),
      },
      (err, str) => {
        if (err) {
          console.log(chalk.red(err));
          process.exit(1);
        }
        fs.writeFileSync(path.join(cwd, 'zh-cn', 'index.html'), str, 'utf8');
      }
    );
  }
  // 生成除博客详情页（blogDetail）、文档页（documentation）首页（home）的其它页面
  const pages = fs.readdirSync(path.join(cwd, './src/pages'));
  pages.forEach(page => {
    if (page === 'blogDetail' || page === 'documentation' || page === 'home') {
      return;
    }
    // 是文件夹并且下面有index.jsx文件
    if (fs.existsSync(path.join(cwd, './src/pages', page, './index.jsx'))) {
      // 导入用ES6 export default导出的模块
      const Page = require(path.join(cwd, './src/pages', page)).default;
      // 生成英文版
      fs.ensureDirSync(path.join(cwd, 'en-us', page));
      ejs.renderFile(
        path.join(cwd, './template.ejs'),
        {
          title: page,
          keywords: page,
          description: page,
          rootPath: window.rootPath,
          page,
          __html: ReactDOMServer.renderToString(React.createElement(Page, { lang: 'en-us' }, null)),
        },
        (err, str) => {
          if (err) {
            console.log(chalk.red(err));
            process.exit(1);
          }
          fs.writeFileSync(path.join(cwd, 'en-us', page, 'index.html'), str, 'utf8');
        }
      );

      // 生成中文版
      fs.ensureDirSync(path.join(cwd, 'zh-cn', page));
      ejs.renderFile(
        path.join(cwd, './template.ejs'),
        {
          title: page,
          keywords: page,
          description: page,
          rootPath: window.rootPath,
          page,
          __html: ReactDOMServer.renderToString(React.createElement(Page, { lang: 'zh-cn' }, null)),
        },
        (err, str) => {
          if (err) {
            console.log(chalk.red(err));
            process.exit(1);
          }
          fs.writeFileSync(path.join(cwd, 'zh-cn', page, 'index.html'), str, 'utf8');
        }
      );
    }
  });
};
module.exports = generateHTMLFile;
