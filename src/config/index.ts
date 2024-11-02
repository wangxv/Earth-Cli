import {cacheDir, outerConfigDir, srcDir, COMPONENTS_FILE} from '../constant';
import {OuterConfig} from '../types';
import {existFile, setFullAssetsDir} from '../utils';
const outerConfig: OuterConfig = existFile(outerConfigDir) ? require(outerConfigDir) : {};
const defaultJsExclude = [/node_modules\/(?!(earth-cli))/];
const defaultExternal = ['vue', 'vuex', 'vue-router'];
const {alias, jsExcludes, jsIncludes, sourceMap, outputPath, assetsPublicPath, htmlTemplateOptions,
  componentsPath, external, rollupJsIncludes, rollupExternal, utilsFileName, rollupReplacer,
} = outerConfig;
const defaultAlias = {
  '@': srcDir
};
const mainConfig = {
  entry: outerConfig.entry || {app: './src/main.ts'},
  htmlTemplateOptions: htmlTemplateOptions || [{path: 'public', filename: 'index.html', entryChunkName: 'app'}],
  outputPath: outputPath || 'dist/h5',
  assetsPublicPath: assetsPublicPath || './',
  cacheDir: outerConfig.cacheDir || cacheDir,
  babelPlugins: outerConfig.babelPlugins || [],
  jsIncludes: jsIncludes? setFullAssetsDir(jsIncludes) : [setFullAssetsDir('./src')],
  rollupJsIncludes: rollupJsIncludes? setFullAssetsDir(rollupJsIncludes) : ['src/**/*'],
  jsExcludes: defaultJsExclude.concat(jsExcludes ?
    setFullAssetsDir(outerConfig.jsExcludes || []) as Array<any> : defaultJsExclude),
  alias: alias ? Object.assign({}, setFullAssetsDir(alias), defaultAlias) : defaultAlias,
  sourceMap: sourceMap || false,
  extractCss: outerConfig || true,
  customLoaders: outerConfig.customLoaders || [],
  webpackPlugins: outerConfig.webpackPlugins || [],
  componentsPath: setFullAssetsDir(componentsPath || './src/components'),
  external: external?.concat(defaultExternal) || defaultExternal,
  rollupExternal: rollupExternal || [],
  rollupReplacer: rollupReplacer || {},
  componentsSrc: outerConfig.componentsSrc || COMPONENTS_FILE,
  utilsFileName: utilsFileName || 'utils',
};

export default mainConfig;

export const utilsReg = new RegExp(`@\/${mainConfig.utilsFileName}`);
