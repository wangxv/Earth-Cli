import mainConfig from '../config';
import {postcssDir} from '../constant';
import fs from 'fs';

type CssSuffix = 'css' | 'less' | 'sass';
const devMode = process.env.NODE_ENV !== 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getStyleLoader = (suffix: string, sourceMap: boolean) => {
  return {
    loader: `${suffix}-loader`,
    options: {
      sourceMap
    }
  }
};
const generateStyleLoader = (suffix: CssSuffix) => {
  const {extractCss} = mainConfig;
  const sourceMap = devMode ? true : mainConfig.sourceMap;
  const cssLoader = getStyleLoader(suffix, sourceMap);
  const loaders = [
    (devMode && extractCss) ? MiniCssExtractPlugin.loader : 'style-loader',
    cssLoader
  ];
  if (suffix !== 'css') {
    loaders.splice(1, 0, getStyleLoader('css', sourceMap));
  }
  const usePostcss = fs.existsSync(postcssDir);
  if (usePostcss) {
    loaders.push({
      loader: 'postcss-loader',
      options: {
        config: {
          path: './postcss.config',
        },
      },
    })
  }
  return {
    test: new RegExp('\\.' + suffix + '$'),
    use: loaders
  };
};
const cssSuffixs: CssSuffix[] = ['css', 'less'];
const cssLoaders = cssSuffixs.map((suffix) => generateStyleLoader(suffix));
export default cssLoaders;
