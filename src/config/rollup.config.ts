// rollup插件
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import { FileManager } from "less";
import url from '@rollup/plugin-url';

import {COMPONENTS_JSON, SCRIPT_EXTS, STYLE_EXTS} from "../constant";
import mainConfig, {utilsReg} from "./";
import cssImportParser from '../loaders/rollupCssParser';
import {joinDir, pascalCase, setFullAssetsDir} from "../utils";
import file from '../utils/file';

const json = require('rollup-plugin-json');
const {external, rollupJsIncludes, rollupExternal, rollupReplacer} = mainConfig;
const babelConfig = require('./babel.config');

const rollExternal = [
  ...external,
  'vue-class-component',
  'vue-property-decorator',
  /@babel\/runtime/,
  'babel-helper-vue-jsx-merge-props',
  utilsReg,
  ...rollupExternal
];
const postcssPlugins = require('./postcss.rollup.config');

// postcss插件加载
const postcssPlugin = (fileDir?: string) => {
  fileDir = fileDir || 'esm';
  return postcss({
    to: joinDir(`dist/${fileDir}`),
    extract: true,
    extensions: STYLE_EXTS,
    plugins: [
      ...postcssPlugin(fileDir).plugins
    ]
  });
}

const entries = Object.entries(mainConfig.alias).map(([key, val]) => {
  return {
    find: key,
    replacement: val
  }
});

class TildeResolver extends FileManager {
  loadFile(filename: string, ...args: any[]) {
    const reg  = /~(.*)/;
    if (reg.test(filename)) {
      filename = filename.replace('~', '');
      const otherArgs = [...args].slice(1);
      return FileManager.prototype.loadFile.apply(this, [filename, setFullAssetsDir('node_modules'), ...otherArgs]);
    }
    return FileManager.prototype.loadFile.apply(this, [filename, ...args]);
  }
}

const lessPlugin = {
  install: (less, pluginManager) => {
    pluginManager.addFileManager(new TildeResolver());
  }
};

const plugins = (postcssPath: string, fileDir: string) => {
  return [
    replace(rollupReplacer),
    url({
      limit: Infinity
    }),
    alias({
      entries
    } as any),
    nodeResolve({
      extensions: SCRIPT_EXTS,
      preferBuiltins: false
    }),
    json(),
    commonjs(),
    vue({
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js',
      css: false,
      style: {
        postcssPlugins: [
          cssImportParser({
            rootContext: setFullAssetsDir('node_modules')
          })
        ],
        preprocessOptions: {
          less: {
            plugins: [lessPlugin]
          }
        }
      }
    } as any),
    postcssPlugin(fileDir),
    babel({
      include: rollupJsIncludes,
      extensions: SCRIPT_EXTS,
      babelHelpers: 'runtime',
      babelrc: false,
      ...babelConfig(true)
    })
  ]
};


// 组件配置
const createComponentsConfig = (format: 'es' | 'cjs') => {
  const components = require(COMPONENTS_JSON) || {};
  const isES = format === 'es';
  const fileDir = isES ? 'esm' : 'lib';
  const config: any = [];

  for (let name in components) {
    const componentFile = `Ea${pascalCase(name)}`;
    config.push({
      input: components[name],
      external: rollExternal,
      plugins: [...plugins(`dist/${fileDir}/${componentFile}/index.css`, fileDir)],
      output: {
        file: `dist/${fileDir}/${componentFile}/index.js`,
        format,
        ...isES ? {} : {exports: 'default'},
        paths: (id) => {
          if (utilsReg.test(id)) {
            return id.replace(utilsReg, '../utils')
          }
        }
      }
    })
  }

  return config;
}

// 样式配置
const createStyleConfig = (entry, outputPath) => {
  const fileDir = process.env.BABEL_MODULE !== 'commonjs' ? 'esm' : 'lib';
  const postCssPlugins = require('./postcss.config');

  return {
    input: entry,
    plugins: [
      postcss({
        to: joinDir(`dist/${fileDir}`),
        extract: true,
        extensions: STYLE_EXTS,
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
}

export { createComponentsConfig, createStyleConfig };