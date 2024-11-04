"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const constant_1 = require("../constant");
const fs_1 = __importDefault(require("fs"));
const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getStyleLoader = (suffix, sourceMap) => {
    return {
        loader: `${suffix}-loader`,
        options: {
            sourceMap
        }
    };
};
const generateStyleLoader = (suffix) => {
    const { extractCss } = config_1.default;
    const sourceMap = devMode ? true : config_1.default.sourceMap;
    const cssLoader = getStyleLoader(suffix, sourceMap);
    const loaders = [
        (devMode && extractCss) ? MiniCssExtractPlugin.loader : 'style-loader',
        cssLoader
    ];
    if (suffix !== 'css') {
        loaders.splice(1, 0, getStyleLoader('css', sourceMap));
    }
    const usePostcss = fs_1.default.existsSync(constant_1.postcssDir);
    if (usePostcss) {
        loaders.push({
            loader: 'postcss-loader',
            options: {
                config: {
                    path: './postcss.config',
                },
            },
        });
    }
    return {
        test: new RegExp('\\.' + suffix + '$'),
        use: loaders
    };
};
const cssSuffixs = ['css', 'less'];
const cssLoaders = cssSuffixs.map((suffix) => generateStyleLoader(suffix));
exports.default = cssLoaders;
