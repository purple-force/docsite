'use strict';

module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        remove: false,
        overrideBrowserslist: [
          'last 5 version',
          '> 0.2%',
          'not ie < 9',
        ],
      },
      // 如果要添加polyfill, 详见https://preset-env.cssdb.org/features#stage-3
      stage: false,
    }),
  ],
};
