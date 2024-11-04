"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_loader_1 = require("vue-loader");
const _1 = __importDefault(require("./"));
const cssLoaders_1 = __importDefault(require("../loaders/cssLoaders"));
const utils_1 = require("../utils");
const babel_config_1 = __importDefault(require("./babel.config"));
const { jsExcludes, jsIncludes, alias, customLoaders, webpackPlugins } = _1.default;
const CACHE_LOADER = {
    loader: 'cache-loader',
    options: {
        cacheDirectory: _1.default.cacheDir,
    },
};
const BABEL_LOADER = {
    loader: 'babel-loader',
    options: Object.assign({ babelrc: false }, (0, babel_config_1.default)())
};
const baseConfig = {
    entry: _1.default.entry,
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
        alias
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    CACHE_LOADER,
                    {
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                // 被设置为false，这意味着在编译过程中，Vue模板中的空白字符（如空格和换行符）将被移除，以减少生成的HTML的大小。
                                preserveWhitespace: false
                            },
                            prettify: false, // 这个选项被设置为false，表示在编译Vue模板时不对其进行美化（即不添加额外的空格和换行符来使其更具可读性）
                            transformAssetUrls: {
                                video: ['src', 'poster'],
                                source: 'src',
                                img: 'src',
                                image: 'xlink:href'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(js|ts|jsx|tsx)$/,
                exclude: jsExcludes,
                include: jsIncludes,
                use: [CACHE_LOADER, BABEL_LOADER]
            },
            ...cssLoaders_1.default,
            ...customLoaders,
            {
                test: /.(png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: (0, utils_1.assetsPath)('static/imgs/*')
                        }
                    }
                ]
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'vue-loader'
                    },
                    {
                        loader: require.resolve('../loaders/markdownParseLoader')
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: (0, utils_1.assetsPath)('static/fonts/'),
                    esModule: false
                }
            }
        ]
    },
    plugins: [
        new vue_loader_1.VueLoaderPlugin(),
        ...webpackPlugins
    ]
};
exports.default = baseConfig;
