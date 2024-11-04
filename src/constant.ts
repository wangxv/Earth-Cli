import path, { join } from 'path';
export const GREEN = '#11c2bc';
export const SCRIPT_EXTS = ['.js', '.jsx', '.vue', '.ts', '.tsx'];
export const STYLE_EXTS = ['.css', '.less', '.scss'];

export const projectDir = path.resolve('.'); // 项目根目录

export const COMPONENTS_JSON = join(projectDir, './components.json'); // 所有组件所在目录, 命令生成
export const DIST = join(projectDir, './dist'); // 编译后的dist文件

export const outerConfigDir = join(projectDir, 'earth.config.js'); // 配置文件

export const cacheDir = join(projectDir, 'node_modules/.cache'); // 缓存文件目录

export const srcDir = join(projectDir, 'src'); // src文件夹位置

export const postcssDir = join(projectDir, 'postcss.config.ts'); // postcss文件位置

export const jestDir = join(projectDir, 'jest.config.js'); // jest文件位置

export const DIST_DIR = join(projectDir, 'dist')

export const PACKAGE_JSON_FILE = join(projectDir, 'package.json');
export const ROUTES_FILE = join(projectDir, 'pc-routes.js')
export const MOBILE_ROUTES_FILE = join(projectDir, 'mobile-routes.js')
export const COMPONENTS_FILE = join(srcDir, 'components'); // 遍历components组件库

export const COMPONENTS_ENTRY = join(COMPONENTS_FILE, 'index.js'); // 组件库入口文件
export const DIST_COMPONENTS_ENTRY = join(DIST, 'index.js'); // 组件库入口文件

export const COMPONENTS_COMMON_STYLE = join(COMPONENTS_FILE, 'style'); // 组件库公共样式文件
export const DIST_COMPONENTS_COMMON_STYLE = (env) => {
  return join(DIST, `${env}/style`)
}; // dist组件库公共样式文件

export const CONFIG_DIR = join(__dirname, '../config');
export const JEST_CONFIG_FILE = join(CONFIG_DIR, 'jest.config.js');
export const VETUR_DIR = join(projectDir, 'vetur')
