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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VETUR_DIR = exports.JEST_CONFIG_FILE = exports.CONFIG_DIR = exports.DIST_COMPONENTS_COMMON_STYLE = exports.COMPONENTS_COMMON_STYLE = exports.DIST_COMPONENTS_ENTRY = exports.COMPONENTS_ENTRY = exports.COMPONENTS_FILE = exports.MOBILE_ROUTES_FILE = exports.ROUTES_FILE = exports.PACKAGE_JSON_FILE = exports.SITE_MOBILE_SHARED_FILE = exports.SITE_DESKTOP_SHARED_FILE = exports.DIST_DIR = exports.jestDir = exports.postcssDir = exports.srcDir = exports.cacheDir = exports.outerConfigDir = exports.DIST = exports.COMPONENTS_JSON = exports.projectDir = exports.STYLE_EXTS = exports.SCRIPT_EXTS = exports.GREEN = void 0;
const path_1 = __importStar(require("path"));
exports.GREEN = '#11c2bc';
exports.SCRIPT_EXTS = ['.js', '.jsx', '.vue', '.ts', '.tsx'];
exports.STYLE_EXTS = ['.css', '.less', '.scss'];
exports.projectDir = path_1.default.resolve('.'); // 项目根目录
exports.COMPONENTS_JSON = (0, path_1.join)(exports.projectDir, './components.json'); // 所有组件所在目录, 命令生成
exports.DIST = (0, path_1.join)(exports.projectDir, './dist'); // 编译后的dist文件
exports.outerConfigDir = (0, path_1.join)(exports.projectDir, 'earth.config.js'); // 配置文件
exports.cacheDir = (0, path_1.join)(exports.projectDir, 'node_modules/.cache'); // 缓存文件目录
exports.srcDir = (0, path_1.join)(exports.projectDir, 'src'); // src文件夹位置
exports.postcssDir = (0, path_1.join)(exports.projectDir, 'postcss.config.ts'); // postcss文件位置
exports.jestDir = (0, path_1.join)(exports.projectDir, 'jest.config.js'); // jest文件位置
exports.DIST_DIR = (0, path_1.join)(exports.projectDir, 'dist');
exports.SITE_DESKTOP_SHARED_FILE = (0, path_1.join)(exports.DIST_DIR, 'site-desktop-shared'); // pc端网站
exports.SITE_MOBILE_SHARED_FILE = (0, path_1.join)(exports.DIST_DIR, 'site-mobile-shared'); // mobile端
exports.PACKAGE_JSON_FILE = (0, path_1.join)(exports.projectDir, 'package.json');
exports.ROUTES_FILE = (0, path_1.join)(exports.projectDir, 'desktop-routes.js');
exports.MOBILE_ROUTES_FILE = (0, path_1.join)(exports.projectDir, 'mobile-routes.js');
exports.COMPONENTS_FILE = (0, path_1.join)(exports.srcDir, 'components'); // 遍历components组件库
exports.COMPONENTS_ENTRY = (0, path_1.join)(exports.COMPONENTS_FILE, 'index.js'); // 组件库入口文件
exports.DIST_COMPONENTS_ENTRY = (0, path_1.join)(exports.DIST, 'index.js'); // 组件库入口文件
exports.COMPONENTS_COMMON_STYLE = (0, path_1.join)(exports.COMPONENTS_FILE, 'style'); // 组件库公共样式文件
const DIST_COMPONENTS_COMMON_STYLE = (env) => {
    return (0, path_1.join)(exports.DIST, `${env}/style`);
}; // dist组件库公共样式文件
exports.DIST_COMPONENTS_COMMON_STYLE = DIST_COMPONENTS_COMMON_STYLE;
exports.CONFIG_DIR = (0, path_1.join)(__dirname, '../config');
exports.JEST_CONFIG_FILE = (0, path_1.join)(exports.CONFIG_DIR, 'jest.config.js');
exports.VETUR_DIR = (0, path_1.join)(exports.projectDir, 'vetur');
