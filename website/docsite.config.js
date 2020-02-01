'use strict';

module.exports = {
  rootPath: '/product', // 发布到服务器的根目录，需以/开头但不能有尾/，如果只有/，请填写空字符串
  port: 8080, // 本地开发服务器的启动端口
  domain: 'dubbo.apache.org', // 站点部署域名，无需协议和path等
  defaultLanguage: 'en-us',
  // 页面相关配置，key为'src/pages'下文件夹名
  pages: {
    // 首页配置
    home: {
      'zh-cn': {
        title: '网页标签title',
        keywords: '关键词1，关键词2',
        description: '页面内容简介',
      },
      'en-us': {
        title: 'page title',
        keywords: 'keyword1,keyword2',
        description: 'page description',
      }
    },
    // 社区页配置
    community: {
      'zh-cn': {
        title: '网页标签title',
        keywords: '关键词1，关键词2',
        description: '页面内容简介',
      },
      'en-us': {
        title: 'page title',
        keywords: 'keyword1,keyword2',
        description: 'page description',
      }
    },
    // 博客列表页
    blog: {
      'zh-cn': {
        title: '网页标签title',
        keywords: '关键词1，关键词2',
        description: '页面内容简介',
      },
      'en-us': {
        title: 'page title',
        keywords: 'keyword1,keyword2',
        description: 'page description',
      }
    },
  },
};