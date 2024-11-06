"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const utils_1 = require("../utils");
const webpack_doc_dev_1 = __importDefault(require("./webpack.doc.dev"));
const _1 = __importDefault(require("./"));
const publicPath = _1.default.assetsPublicPath;
const outputDir = (0, utils_1.joinDir)(_1.default.outputPath);
console.log('devConfig: ', webpack_doc_dev_1.default);
const prodConfig = (0, webpack_merge_1.default)(webpack_doc_dev_1.default, {
    mode: 'production',
    stats: 'none',
    performance: {
        maxAssetSize: 5 * 1024 * 1024,
        maxEntrypointSize: 5 * 1024 * 1024,
    },
    output: {
        publicPath,
        path: outputDir,
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/async_[name].[chunkhash:8].js',
    },
});
exports.default = prodConfig;
