'use strict';

const merge = require('webpack-merge');
const path = require('path');

const getWebpackConfig = env => {
  const customConfig = require(path.join(process.cwd(), 'docsite.config.js'));
  const baseWebpackConfig = require('./webpack.config.js')(env);
  const customWebpackConfig = typeof customConfig.webpack === 'function' ?
    customConfig.webpack(env) : customConfig.webpack;
  return merge(baseWebpackConfig, customWebpackConfig || {});
};

module.exports = getWebpackConfig;
