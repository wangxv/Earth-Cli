import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
export interface WebpackConfig extends Webpack.Configuration {
    devServer?: WebpackDevServer.Configuration;
}
export interface ObjectType {
    [propsName: string]: string;
}
export interface TemplateOptions {
    filename: string;
    path: string;
    entryChunkName: string;
}
export interface OuterConfig {
    entry?: ObjectType;
    htmlTemplateOptions?: Array<TemplateOptions>;
    outputPath?: string;
    assetsPublicPath?: string;
    cacheDir?: string;
    babelPlugins?: any[];
    jsIncludes?: Array<string | RegExp>;
    rollupJsIncludes?: Array<RegExp>;
    jsExcludes?: Array<string | RegExp>;
    alias?: ObjectType;
    sourceMap?: boolean;
    extractCss?: boolean;
    customLoaders?: any[];
    webpackPlugins?: any[];
    componentsSrc?: string;
    componentsPath?: string;
    external?: Array<string>;
    rollupReplacer?: ObjectType;
    rollupExternal?: Array<string>;
    utilsFileName?: string;
}
