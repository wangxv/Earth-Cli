import merge from 'webpack-merge';
import WebpackBar from 'webpackbar';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { existsSync } from 'fs-extra';
import { TemplateOptions, WebpackConfig } from '../types';
import {setFullAssetsDir, existFile, joinDir} from '../utils';
import mainConfig from './';
import { GenRoutesPlugin } from '../compiler/gen-doc';
import baseConfig from './webpack.base';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { entry, htmlTemplateOptions } = mainConfig;
const getHtmlWebpackPlugin = () => {
  return (htmlTemplateOptions as Array<TemplateOptions>).map((opts) => {
    const publicPath = setFullAssetsDir(opts.path);
    const template = publicPath + 'index.html';
    const favicon = publicPath + 'favicon.ico';
    return new HtmlWebpackPlugin({
      filename: opts.filename,
      chunks: ['chunks', opts.entryChunkName],
      template,
      ...(existFile(favicon) ? { favicon } : {}),
      inject: true, // 插件自动地将所有的webpack生成的资源（如CSS和JS文件）注入到HTML文件中。
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 折叠空白字符（比如空格、制表符、换行符等），以减少文件大小
        removeAttributeQuotes: true // 移除属性值的引号，如果属性值不包含空格或特殊字符的话
      }
    })
  })
};

const devConfig: WebpackConfig = merge(baseConfig, {
entry,
output: {
  chunkFilename: 'static/js/[name].[chunkhash:8].js',
},
devtool: 'cheap-module-eval-source-map',
devServer: {
  port: 8080,
  quiet: true,
  host: '0.0.0.0',
  stats: 'errors-only',
  publicPath: '/',
  disableHostCheck: true
},
optimization: {
  splitChunks: {
    cacheGroups: {
      chunks: {
        chunks: 'all',
        minChunks: 2,
        minSize: 0,
        name: 'chunks'
      }
    }
  }
},
plugins: [
  new ForkTsCheckerWebpackPlugin({
    eslint: {
      files: './src/**/*.{ts, tsx, js, jsx, vue}'
    }
  }),
  existsSync(setFullAssetsDir('static')) ? new CopyWebpackPlugin({
    patterns: [
      {
        from: joinDir('static'),
        to: joinDir('static'),
        globalOptions: {
          ignore: ['*.']
        }
      }
    ]
  }) : () => {},
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash:8].css'
  }),
  new WebpackBar({
    name: 'Earth Cli',
    color: '#11c2bc'
  }),
  new GenRoutesPlugin(),
  ...getHtmlWebpackPlugin()
]
} as WebpackConfig)

export default devConfig;