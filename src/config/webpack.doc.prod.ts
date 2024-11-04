import merge from 'webpack-merge';
import {WebpackConfig} from '../types';
import {joinDir} from '../utils';
import devConfig from './webpack.doc.dev';
import mainConfig from './';
const publicPath = mainConfig.assetsPublicPath;
const outputDir = joinDir(mainConfig.outputPath);

const prodConfig: WebpackConfig  = merge(devConfig, {
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

export default prodConfig;