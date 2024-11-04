"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpackbar_1 = __importDefault(require("webpackbar"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const fs_extra_1 = require("fs-extra");
const utils_1 = require("../utils");
const _1 = __importDefault(require("./"));
const gen_doc_1 = require("../compiler/gen-doc");
const webpack_base_1 = __importDefault(require("./webpack.base"));
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { entry, htmlTemplateOptions } = _1.default;
const getHtmlWebpackPlugin = () => {
    return htmlTemplateOptions.map((opts) => {
        const publicPath = (0, utils_1.setFullAssetsDir)(opts.path);
        const template = publicPath + 'index.html';
        const favicon = publicPath + 'favicon.ico';
        return new html_webpack_plugin_1.default(Object.assign(Object.assign({ filename: opts.filename, chunks: ['chunks', opts.entryChunkName], template }, ((0, utils_1.existFile)(favicon) ? { favicon } : {})), { inject: true, minify: {
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 折叠空白字符（比如空格、制表符、换行符等），以减少文件大小
                removeAttributeQuotes: true // 移除属性值的引号，如果属性值不包含空格或特殊字符的话
            } }));
    });
};
const devConfig = (0, webpack_merge_1.default)(webpack_base_1.default, {
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
        (0, fs_extra_1.existsSync)((0, utils_1.setFullAssetsDir)('static')) ? new CopyWebpackPlugin({
            patterns: [
                {
                    from: (0, utils_1.joinDir)('static'),
                    to: (0, utils_1.joinDir)('static'),
                    globalOptions: {
                        ignore: ['*.']
                    }
                }
            ]
        }) : () => { },
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css'
        }),
        new webpackbar_1.default({
            name: 'Earth Cli',
            color: '#11c2bc'
        }),
        new gen_doc_1.GenRoutesPlugin(),
        ...getHtmlWebpackPlugin()
    ]
});
exports.default = devConfig;
