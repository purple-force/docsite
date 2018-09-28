'use strict';

const fs = require('fs-extra');
const path = require('path');
const Mkit = require('markdown-it');
const hljs = require('highlight.js');
// const markdownGithubToc = require('markdown-it-github-toc');
const markdownItGithubPreamble = require('markdown-it-github-preamble');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItKatex = require('markdown-it-katex');
// const markdownItLinkAttributes = require('markdown-it-link-attributes');
// const markdownItReplaceLink = require('markdown-it-replace-link');

const md = new Mkit({
  html: true,
  linkify: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        console.log(err);
      }
    }
    return ''; // use external default escaping
  },
})
  .use(markdownItGithubPreamble)
  .use(markdownItFootnote)
  .use(markdownItKatex);

function splitMetaAndContent(text) {
  const result = {
    header: '',
    content: '',
  };
  const lines = text.split(/\r?\n/);
  // 元数据放入---（至少三个）之间，顶格顶行写
  if (lines[0].indexOf('---') === 0) {
    const len = lines.length;
    let i = 1;
    for (; i < len; i++) {
      if (lines[i].indexOf('---') === 0) {
        break;
      }
    }
    result.header = lines.slice(1, i).join('\n');
    result.content = lines.slice(i + 1).join('\n');
  } else {
    result.content = lines.join('\n');
  }
  return result;
}

function parseMd(filePath) {
  const result = {
    meta: {},
    __html: '',
  };
  if (filePath) {
    const extension = path.extname(filePath);
    if (extension === '.md' || extension === '.markdown') {
      const text = fs.readFileSync(filePath, 'utf8');
      const splitData = splitMetaAndContent(text);
      const metas = splitData.header.split('\n');
      metas.forEach(data => {
        const kv = data.split(':');
        const key = kv[0].trim();
        if (key === '') {
          return;
        }
        const value = kv
          .slice(1)
          .join(':')
          .trim();
        result.meta[key] = value;
      });

      result.__html = md.render(splitData.content);
    }
  }
  return result;
}
module.exports = parseMd;
