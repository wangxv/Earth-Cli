import Webpack from 'webpack';

import WebpackDevServer from 'webpack-dev-server';

export interface WebpackConfig extends Webpack.Configuration {
  devServer?: WebpackDevServer.Configuration;
}

export interface ObjectType {
  [propsName: string]: string;
}

export interface TemplateOptions {
  filename: string; // 模版文件名
  path: string; // 模版所在文件夹路径
  entryChunkName: string; // 入口文件chunk名
}


export interface OuterConfig {
  entry?: ObjectType; // 入口文件
  htmlTemplateOptions?: Array<TemplateOptions>; // html模版信息
  outputPath?: string; // 出口文件
  assetsPublicPath?: string; // 静态文件地址
  cacheDir?: string; // 缓存文件目录
  babelPlugins?: any[]; // babel插件
  jsIncludes?: Array<string|RegExp>; // 要babel 编译的js文件列表
  rollupJsIncludes?: Array<RegExp>; // rollup要babel 编译的js文件列表
  jsExcludes?: Array<string|RegExp>; // 忽略编译的js文件列表
  alias?: ObjectType; // webpack resolve alias
  sourceMap?: boolean; //是否开启sourceMap
  extractCss?: boolean;
  customLoaders?: any[],
  webpackPlugins?: any[],
  componentsSrc?: string; // 组件库路径
  componentsPath?: string; // 组件所在根文件夹
  external?: Array<string>; // 组件库打包external
  rollupReplacer?: ObjectType; // 组件库打包replace，参考'@rollup/plugin-replace'
  rollupExternal?: Array<string>; // 组件库rollup编译的external
  utilsFileName?: string; // 组件库utils 文件名，默认utils
}