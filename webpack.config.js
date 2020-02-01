'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const fs = require('fs-extra');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseBabelConfig = require('./babel.config.js');
const basePostcssConfig = require('./postcss.config.js');


// 处理入口文件
const entry = {};
const targetPath = path.join(process.cwd(), './src/pages');
fs.readdirSync(targetPath).forEach(page => {
  if (
    fs.statSync(path.join(targetPath, page)).isDirectory() &&
    fs.existsSync(path.join(targetPath, page, 'index.jsx'))
  ) {
    entry[page] = path.join(targetPath, page, 'index.jsx');
  }
});

const customConfig = require(path.join(process.cwd(), 'docsite.config.js'));

// 获取babel配置
const babelConfig = merge(baseBabelConfig, customConfig.babel || {});
// 获取postcss配置
const postcssConfig = merge(basePostcssConfig, customConfig.postcss || {});

module.exports = env => {
  const config = {
    mode: env,
    target: 'web',
    entry,
    devtool: env === 'development' ? 'source-map' : false,
    output: {
      path: path.join(process.cwd(), 'build'),
      filename: '[name].js',
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
          ],
        },
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ...postcssConfig,
              },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // 结合resolve-url-loader使用必填，详见https://www.npmjs.com/package/resolve-url-loader
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)((\?|#).*)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          }],
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial',
            minSize: 0,
          },
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
  };

  if (env === 'development') {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
        __DEV__: JSON.stringify('true'),
      })
    );
  }

  if (env === 'production') {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
        __DEV__: JSON.stringify('false'),
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: [
            'default',
            { discardComments: { remove: comment => comment[0] !== '!' && comment[0] !== '#' } },
          ],
        },
      })
    );
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        extractComments: false,
        parallel: true,
        cache: true,
        sourceMap: false,
      }),
    ];
  }
  return config;
};
