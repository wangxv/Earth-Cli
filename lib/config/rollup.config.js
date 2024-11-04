"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStyleConfig = exports.createComponentsConfig = void 0;
// rollup插件
const plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_alias_1 = __importDefault(require("@rollup/plugin-alias"));
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const rollup_plugin_vue_1 = __importDefault(require("rollup-plugin-vue"));
const rollup_plugin_postcss_1 = __importDefault(require("rollup-plugin-postcss"));
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const less_1 = require("less");
const plugin_url_1 = __importDefault(require("@rollup/plugin-url"));
const constant_1 = require("../constant");
const _1 = __importStar(require("./"));
const rollupCssParser_1 = __importDefault(require("../loaders/rollupCssParser"));
const utils_1 = require("../utils");
const json = require('rollup-plugin-json');
const { external, rollupJsIncludes, rollupExternal, rollupReplacer } = _1.default;
const babelConfig = require('./babel.config');
const rollExternal = [
    ...external,
    'vue-class-component',
    'vue-property-decorator',
    /@babel\/runtime/,
    'babel-helper-vue-jsx-merge-props',
    _1.utilsReg,
    ...rollupExternal
];
const postcssPlugins = require('./postcss.rollup.config');
// postcss插件加载
const postcssPlugin = (fileDir) => {
    fileDir = fileDir || 'esm';
    return (0, rollup_plugin_postcss_1.default)({
        to: (0, utils_1.joinDir)(`dist/${fileDir}`),
        extract: true,
        extensions: constant_1.STYLE_EXTS,
        plugins: [
            ...postcssPlugin(fileDir).plugins
        ]
    });
};
const entries = Object.entries(_1.default.alias).map(([key, val]) => {
    return {
        find: key,
        replacement: val
    };
});
class TildeResolver extends less_1.FileManager {
    loadFile(filename, ...args) {
        const reg = /~(.*)/;
        if (reg.test(filename)) {
            filename = filename.replace('~', '');
            const otherArgs = [...args].slice(1);
            return less_1.FileManager.prototype.loadFile.apply(this, [filename, (0, utils_1.setFullAssetsDir)('node_modules'), ...otherArgs]);
        }
        return less_1.FileManager.prototype.loadFile.apply(this, [filename, ...args]);
    }
}
const lessPlugin = {
    install: (less, pluginManager) => {
        pluginManager.addFileManager(new TildeResolver());
    }
};
const plugins = (postcssPath, fileDir) => {
    return [
        (0, plugin_replace_1.default)(rollupReplacer),
        (0, plugin_url_1.default)({
            limit: Infinity
        }),
        (0, plugin_alias_1.default)({
            entries
        }),
        (0, plugin_node_resolve_1.nodeResolve)({
            extensions: constant_1.SCRIPT_EXTS,
            preferBuiltins: false
        }),
        json(),
        (0, plugin_commonjs_1.default)(),
        (0, rollup_plugin_vue_1.default)({
            normalizer: '~vue-runtime-helpers/dist/normalize-component.js',
            css: false,
            style: {
                postcssPlugins: [
                    (0, rollupCssParser_1.default)({
                        rootContext: (0, utils_1.setFullAssetsDir)('node_modules')
                    })
                ],
                preprocessOptions: {
                    less: {
                        plugins: [lessPlugin]
                    }
                }
            }
        }),
        postcssPlugin(fileDir),
        (0, plugin_babel_1.default)(Object.assign({ include: rollupJsIncludes, extensions: constant_1.SCRIPT_EXTS, babelHelpers: 'runtime', babelrc: false }, babelConfig(true)))
    ];
};
// 组件配置
const createComponentsConfig = (format) => {
    const components = require(constant_1.COMPONENTS_JSON) || {};
    const isES = format === 'es';
    const fileDir = isES ? 'esm' : 'lib';
    const config = [];
    for (let name in components) {
        const componentFile = `Ea${(0, utils_1.pascalCase)(name)}`;
        config.push({
            input: components[name],
            external: rollExternal,
            plugins: [...plugins(`dist/${fileDir}/${componentFile}/index.css`, fileDir)],
            output: Object.assign(Object.assign({ file: `dist/${fileDir}/${componentFile}/index.js`, format }, isES ? {} : { exports: 'default' }), { paths: (id) => {
                    if (_1.utilsReg.test(id)) {
                        return id.replace(_1.utilsReg, '../utils');
                    }
                } })
        });
    }
    return config;
};
exports.createComponentsConfig = createComponentsConfig;
// 样式配置
const createStyleConfig = (entry, outputPath) => {
    const fileDir = process.env.BABEL_MODULE !== 'commonjs' ? 'esm' : 'lib';
    const postCssPlugins = require('./postcss.config');
    return {
        input: entry,
        plugins: [
            (0, rollup_plugin_postcss_1.default)({
                to: (0, utils_1.joinDir)(`dist/${fileDir}`),
                extract: true,
                extensions: constant_1.STYLE_EXTS,
                plugins: postCssPlugins.plugins,
                use: {
                    sass: {},
                    stylus: {},
                    less: {
                        plugins: [lessPlugin]
                    }
                }
            })
        ],
        output: {
            file: outputPath || `dist/${fileDir}/index.css`
        }
    };
};
exports.createStyleConfig = createStyleConfig;
