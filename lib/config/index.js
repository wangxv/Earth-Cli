"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilsReg = void 0;
const constant_1 = require("../constant");
const utils_1 = require("../utils");
const outerConfig = (0, utils_1.existFile)(constant_1.outerConfigDir) ? require(constant_1.outerConfigDir) : {};
const defaultJsExclude = [/node_modules\/(?!(earth-cli))/];
const defaultExternal = ['vue', 'vuex', 'vue-router'];
const { alias, jsExcludes, jsIncludes, sourceMap, outputPath, assetsPublicPath, htmlTemplateOptions, componentsPath, external, rollupJsIncludes, rollupExternal, utilsFileName, rollupReplacer, } = outerConfig;
const defaultAlias = {
    '@': constant_1.srcDir
};
const mainConfig = {
    entry: outerConfig.entry || { app: './src/main.ts' },
    htmlTemplateOptions: htmlTemplateOptions || [{ path: 'public', filename: 'index.html', entryChunkName: 'app' }],
    outputPath: outputPath || 'dist/h5',
    assetsPublicPath: assetsPublicPath || './',
    cacheDir: outerConfig.cacheDir || constant_1.cacheDir,
    babelPlugins: outerConfig.babelPlugins || [],
    jsIncludes: jsIncludes ? (0, utils_1.setFullAssetsDir)(jsIncludes) : [(0, utils_1.setFullAssetsDir)('./src')],
    rollupJsIncludes: rollupJsIncludes ? (0, utils_1.setFullAssetsDir)(rollupJsIncludes) : ['src/**/*'],
    jsExcludes: defaultJsExclude.concat(jsExcludes ?
        (0, utils_1.setFullAssetsDir)(outerConfig.jsExcludes || []) : defaultJsExclude),
    alias: alias ? Object.assign({}, (0, utils_1.setFullAssetsDir)(alias), defaultAlias) : defaultAlias,
    sourceMap: sourceMap || false,
    extractCss: outerConfig || true,
    customLoaders: outerConfig.customLoaders || [],
    webpackPlugins: outerConfig.webpackPlugins || [],
    componentsPath: (0, utils_1.setFullAssetsDir)(componentsPath || './src/components'),
    external: (external === null || external === void 0 ? void 0 : external.concat(defaultExternal)) || defaultExternal,
    rollupExternal: rollupExternal || [],
    rollupReplacer: rollupReplacer || {},
    componentsSrc: outerConfig.componentsSrc || constant_1.COMPONENTS_FILE,
    utilsFileName: utilsFileName || 'utils',
};
exports.default = mainConfig;
exports.utilsReg = new RegExp(`@\/${mainConfig.utilsFileName}`);
