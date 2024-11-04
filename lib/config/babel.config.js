"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const utils_1 = require("../utils");
function default_1(useESModules) {
    if (utils_1.CheckType.isUndefined(useESModules)) {
        const { BABEL_MODULE } = process.env;
        useESModules = BABEL_MODULE !== 'commonjs';
    }
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    loose: true,
                    modules: useESModules ? false : 'commonjs',
                    useBuiltIns: false
                }
            ],
            [
                '@babel/preset-typescript',
                {
                    isTSX: true,
                    allExtension: true
                }
            ]
        ],
        plugins: [
            'const-enum',
            [
                '@babel/plugin-transform-runtime',
                {
                    useESModules
                }
            ],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-jsx',
            'transform-vue-jsx',
            [
                '@babel/plugin-proposal-decorators',
                {
                    'legacy': true
                }
            ],
            [
                '@babel/plugin-proposal-class-properties',
                {
                    'loose': true
                }
            ],
            '@babel/plugin-transform-typescript'
        ]
    };
}
