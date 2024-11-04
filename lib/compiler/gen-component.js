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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPackage = exports.genComponentVetur = exports.genComponentEntry = exports.genComponentJson = void 0;
const path_1 = require("path");
const tapable_1 = require("tapable");
const rollup_1 = require("rollup");
const chalk_1 = __importDefault(require("chalk"));
const config_1 = __importStar(require("../config"));
const file_1 = __importDefault(require("../utils/file"));
const constant_1 = require("../constant");
const utils_1 = require("../utils");
const rollup_config_1 = require("../config/rollup.config");
const core_1 = require("@babel/core");
const babel_config_1 = __importDefault(require("../config/babel.config"));
const glob = require('glob');
const pkg = require(constant_1.PACKAGE_JSON_FILE);
const md = require('markdown-it')();
md.use(require('markdown-it-container'), 'props');
md.use(require('markdown-it-container'), 'desc');
const parser = require('posthtml-parser');
// 生成组件映射表
const genComponentJson = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const { componentsPath } = config_1.default;
        const entryJson = {};
        glob(`*/index.@(js|ts|tsx|jsx|vue)`, {
            cwd: `${componentsPath}`,
            nodir: true
        }, (err, files) => {
            if (err)
                reject(err);
            files.map((path) => __awaiter(void 0, void 0, void 0, function* () {
                const fullPath = (0, path_1.join)(componentsPath, path);
                const fileName = path.split('/')[0];
                if (entryJson[fileName]) {
                    reject(`一个组件只允许有一个入口文件，${fileName}有多个`);
                }
                else {
                    entryJson[fileName] = fullPath;
                }
            }));
            console.log('组件文件映射表：', entryJson);
            file_1.default.writeJson(entryJson, constant_1.COMPONENTS_JSON);
            resolve(entryJson);
        });
    }));
});
exports.genComponentJson = genComponentJson;
// 拼凑组件引入代码
const genImport = (entries) => {
    return entries.map(([key, value]) => {
        return (`import ${key} from '${value}';`);
    }).concat().join('\n');
};
// 拼凑组件导出代码
const genExport = (entries) => {
    return entries.map(([key]) => (key).join(',\n'));
};
// 拼凑组件
const genContent = ({ pathResolver }) => {
    const version = `${pkg.version}`;
    const components = require(constant_1.COMPONENTS_JSON) || {};
    const allEntry = Object.assign({}, components);
    const entries = Object.entries(allEntry)
        .filter(([, value]) => {
        if (value)
            return (0, utils_1.hasDefaultExport)(file_1.default.readFile(value));
    })
        .map(([key, value]) => {
        key = `Ea${(0, utils_1.pascalCase)(key)}`; // 拼组件前缀 EaRadioGroup
        const pathValue = pathResolver(value, key);
        return [key, pathValue];
    });
    const content = `
    ${genImport(entries)}
    const version = '${version}';
    const components = [
      ${genExport(entries)}
    ];
    function install(app) {
      components.forEach(item => {
        if (item.install) {
          app.use(item);
        } else if (item.name) {
          app.component(item.name, item); 
        }
      });
    }

    export {
      ${genExport(entries)}
    }

    export default {
      install,
      version
    }
  `;
    return content;
};
// 生成组件入口文件
const genComponentEntry = () => __awaiter(void 0, void 0, void 0, function* () {
    const originEntryContent = genContent({
        pathResolver: (path) => {
            return `./${(0, utils_1.resolveAbsPath)((0, utils_1.normalizePath)(path), 'components')}`;
        }
    });
    yield file_1.default.writeFile(constant_1.COMPONENTS_ENTRY, originEntryContent);
    console.log(`生成${constant_1.COMPONENTS_ENTRY}成功`);
    const distEntryContent = genContent({
        pathResolver: (path, key) => {
            return `./${key}/index`;
        }
    });
    yield file_1.default.writeFile(constant_1.DIST_COMPONENTS_ENTRY, distEntryContent);
    console.log(`生成${constant_1.DIST_COMPONENTS_ENTRY}成功`);
});
exports.genComponentEntry = genComponentEntry;
class VeturParser {
    constructor() {
        this.tags = {};
        this.attributes = {};
        this.currentTag = '';
        this.hooks = {
            // @ts-ignore
            className: new tapable_1.SyncHook(['node', 'className']),
            // @ts-ignore
            tag: new tapable_1.SyncHook(['node', 'tag']),
            text: new tapable_1.SyncHook(['node']),
        };
        this.tags = {};
        this.attributes = {};
        this.currentTag = '';
    }
    processValue(content) {
        if (!content || !content.length)
            return '';
        let str = '';
        content.forEach(node => {
            if (typeof node !== 'string') {
                str += node.content[0];
            }
            else {
                str += node;
            }
        });
        return str;
    }
    // 赋初始值
    generateTag() {
        if (this.tags[this.currentTag])
            return;
        this.tags[this.currentTag] = {};
    }
    // 属性赋值
    generateAttributes(attr, desc) {
        this.attributes[`${this.currentTag}/${attr}`] = {
            description: desc
        };
        if (this.tags[this.currentTag]) {
            this.tags[this.currentTag].attributes ? this.tags[this.currentTag].attributes.push(attr) : (this.tags[this.currentTag].attributes = [attr]);
        }
        else {
            this.tags[this.currentTag] = {
                attributes: [attr]
            };
        }
    }
    generateDescription(desc) {
        if (this.tags[this.currentTag]) {
            this.tags[this.currentTag].description = desc;
        }
        else {
            this.tags[this.currentTag] = { description: desc };
        }
    }
    initCallback() {
        let propsNode = null;
        let descNode = null;
        this.applyEvents({
            ClassName: (node, className) => {
                if (className === 'props') {
                    propsNode = node;
                }
                if (className === 'desc') {
                    descNode = node;
                }
            },
            Tag: (node, tag) => {
                if (tag === 'tbody' && propsNode) {
                    const trList = node.content.filter(item => item.tag === 'tr');
                    trList.forEach(item => {
                        const tdList = item.content.filter(item => item.tag === 'td');
                        if (tdList[0] && trList[0].content) {
                            const attr = this.processValue(tdList[0].content);
                            const desc = this.processValue(tdList[1].content);
                            this.generateAttributes(attr, desc);
                        }
                    });
                    propsNode = null;
                    if (tag === 'p' && descNode) {
                        this.generateDescription(this.processValue(node.content));
                        descNode = null;
                    }
                }
            }
        });
    }
    // 监控hook
    applyEvents(tapCallback) {
        this.hooks.className.tap('className', tapCallback.ClassName);
        this.hooks.text.tap('text', tapCallback.Text);
        this.hooks.tag.tap('tag', tapCallback.Tag);
    }
    traverse(ast) {
        ast.forEach(node => {
            if (typeof node === 'object') {
                if (node.attrs && node.attrs.class) {
                    // @ts-ignore
                    this.hooks.className.call(node, node.attrs.class);
                }
                if (node.tag) {
                    // @ts-ignore
                    this.hooks.tag.call(node, node.tag);
                }
            }
            else {
                this.hooks.text.call(node);
            }
            node.content && this.traverse(node.content);
        });
    }
    compile() {
        const fileList = file_1.default.readdirSync(constant_1.COMPONENTS_FILE);
        this.initCallback();
        fileList.forEach(fileItem => {
            const readme = (0, path_1.resolve)(constant_1.COMPONENTS_ENTRY, `./${fileItem}/README.md`);
            if (file_1.default.existsSync(readme)) {
                const content = file_1.default.readFile(readme).toString();
                const result = md.render(content);
                const ast = parser(result);
                this.currentTag = 'ea-' + fileItem;
                this.traverse(ast);
            }
        });
    }
    emit() {
        if (!file_1.default.existsSync(constant_1.VETUR_DIR)) {
            file_1.default.mkdirSync(constant_1.VETUR_DIR);
        }
        file_1.default.writeFile((0, path_1.resolve)(constant_1.VETUR_DIR, 'attributes.json'), JSON.stringify(this.attributes));
        file_1.default.writeFile((0, path_1.resolve)(constant_1.VETUR_DIR, 'tags.json'), JSON.stringify(this.tags));
    }
    run() {
        this.compile();
        this.emit();
    }
}
const genComponentVetur = () => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new VeturParser();
    parser.run();
});
exports.genComponentVetur = genComponentVetur;
/**
 * rollup打包组件
 *
 */
function compileJs(filePath, shouldRemove, targetFilePath) {
    return new Promise((resolve, reject) => {
        let code = file_1.default.readFile(filePath);
        if (config_1.utilsReg.test(code)) {
            reject(`${filePath}文件中，请将'@/utils'替换为非alias写法`);
        }
        (0, core_1.transformAsync)(code, Object.assign({ filename: filePath, babelrc: false }, (0, babel_config_1.default)()))
            .then((result) => {
            if (result) {
                const finalFilePath = targetFilePath ? targetFilePath : (0, utils_1.replaceExt)(filePath, '.js');
                if (shouldRemove) {
                    file_1.default.removeSync(filePath);
                }
                file_1.default.writeFile(finalFilePath, result.code);
                resolve(undefined);
            }
        });
    });
}
function compileDir(dirPath, shouldRemove, targetDirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = file_1.default.readdirSync(dirPath);
        return Promise.all(files.map((filename) => {
            const filePath = (0, path_1.join)(dirPath, filename);
            const targetFilePath = targetDirPath ? (0, path_1.join)(targetDirPath, filename) : undefined;
            if (file_1.default.isDir(filePath)) {
                return compileDir(filePath, shouldRemove, targetFilePath);
            }
            return compileJs(filePath, shouldRemove, targetFilePath);
        })).catch((err) => {
            console.log(chalk_1.default.red(err));
            process.exit(1);
        });
    });
}
function compileUtils() {
    return __awaiter(this, void 0, void 0, function* () {
        const COMPONENTS_UTILS = (0, path_1.join)(constant_1.srcDir, config_1.default.utilsFileName); // 组件库utils
        const DIST_ESM_COMPONENTS_UTILS = (0, path_1.join)(constant_1.DIST, `esm/${config_1.default.utilsFileName}`); // dist/esm组件库utils
        const DIST_LIB_COMPONENTS_UTILS = (0, path_1.join)(constant_1.DIST, `lib/${config_1.default.utilsFileName}`); // dist/lib组件库utils
        const useESModules = process.env.BABEL_MODULE !== 'commonjs';
        const distPath = useESModules ? DIST_ESM_COMPONENTS_UTILS : DIST_LIB_COMPONENTS_UTILS;
        yield file_1.default.copySync(COMPONENTS_UTILS, distPath);
        yield compileDir(distPath, true);
    });
}
const genStyleImport = () => {
    const components = require(constant_1.COMPONENTS_JSON) || {};
    return Object.keys(components)
        .map((name) => {
        const key = 'Ea' + (0, utils_1.pascalCase)(name);
        return (`@import './${key}/index.css';`);
    }).concat().join('\n');
};
const compileStyle = (entry, shouldRemove, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = (0, rollup_config_1.createStyleConfig)(entry, outputPath);
        const bundle = yield (0, rollup_1.rollup)(config);
        yield bundle.write(config.output);
        if (shouldRemove) {
            file_1.default.removeSync(entry);
        }
        const filename = config.output.file;
        console.log(`${chalk_1.default.hex(constant_1.GREEN)(filename)}`);
    }
    catch (err) {
        console.log(err);
    }
});
const compileStyleDir = (dirPath, shouldRemove, targetDirPath) => __awaiter(void 0, void 0, void 0, function* () {
    const files = file_1.default.readdirSync(dirPath);
    return Promise.all(files.map((filename) => {
        const filePath = (0, path_1.join)(dirPath, filename);
        (0, utils_1.replaceExt)(filePath, '.css');
        const targetFilePath = targetDirPath ? (0, path_1.join)(targetDirPath, filename) : filePath;
        if (file_1.default.isDir(filePath)) {
            return compileStyle(filePath, shouldRemove, targetFilePath);
        }
        compileStyle(filePath, shouldRemove, targetFilePath);
    })).catch((err) => {
        console.log(chalk_1.default.red(err));
        process.exit(1);
    });
});
const addStyleToComponent = (env) => __awaiter(void 0, void 0, void 0, function* () {
    const dirPath = (0, path_1.join)(constant_1.DIST_DIR, env);
    const files = file_1.default.readdirSync(dirPath);
    const commonStyle = ['base.css'];
    const content = commonStyle.map((common) => {
        return (`import '../../style/${common}';`);
    }).concat([`import '../index.css';`]).join('\n');
    files.map(filename => {
        if (/^Ea/.test(filename)) {
            const filePath = (0, path_1.join)(dirPath, filename);
            const targetStyleDir = (0, path_1.join)(filePath, 'style/index.js');
            file_1.default.writeFile(targetStyleDir, content);
        }
    });
});
const genComponentStyle = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 编译common style
        if (file_1.default.existsSync(constant_1.COMPONENTS_COMMON_STYLE)) {
            const useESModules = process.env.BABEL_MODULE !== 'commonjs';
            const env = useESModules ? 'esm' : 'lib';
            const distPath = (0, constant_1.DIST_COMPONENTS_COMMON_STYLE)(env);
            yield file_1.default.copySync(constant_1.COMPONENTS_COMMON_STYLE, distPath);
            yield compileStyleDir(distPath, true);
        }
    }
    catch (err) {
        console.log(err);
    }
});
function genEntryStyle() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = genStyleImport();
            const env = process.env.BABEL_MODULE !== 'commonjs' ? 'esm' : 'lib';
            const filePath = `${constant_1.DIST_DIR}/${env}/index.less`;
            yield file_1.default.writeFile(filePath, content);
            compileStyle(filePath);
            yield genComponentStyle();
            addStyleToComponent(env);
        }
        catch (err) {
            console.log(err);
        }
    });
}
/**
 * 使用rollup打包
 * @param format 打包类型
 */
const compilePackage = (format) => __awaiter(void 0, void 0, void 0, function* () {
    const configs = (0, rollup_config_1.createComponentsConfig)(format);
    yield Promise.all(configs.map((config) => __awaiter(void 0, void 0, void 0, function* () {
        const bundle = yield (0, rollup_1.rollup)(config);
        yield bundle.write(config.output);
        const fileName = config.output.file;
        console.log(`${chalk_1.default.hex(constant_1.GREEN)(fileName)}`);
    })));
});
/**
 * 打包组件
 * 1、将组件打包为esmodule格式
 * 2、将组件打包为commonjs格式
 */
const buildPackage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pkg = require(constant_1.PACKAGE_JSON_FILE);
        const esDist = pkg.module ? pkg.module : 'dist/esm/index.es.js';
        const libDist = pkg.main ? pkg.main : 'dist/lib/index.lib.js';
        console.log(`${chalk_1.default.bold('开始编译es文件')}:`);
        (0, utils_1.setModuleEnv)('esmodule');
        const _start = new Date().getTime();
        yield compilePackage('es');
        yield compileJs(constant_1.DIST_COMPONENTS_ENTRY, false, esDist);
        yield compileUtils();
        yield genEntryStyle();
        const _end = new Date().getTime();
        console.log(`编译es耗时${chalk_1.default.red(_end - _start)}:`);
        console.log(`${chalk_1.default.bold('开始编译lib文件')}:`);
        (0, utils_1.setModuleEnv)('commonjs');
        yield compilePackage('cjs');
        yield compileJs(constant_1.DIST_COMPONENTS_ENTRY, false, libDist);
        yield compileUtils();
        yield genEntryStyle();
        // 删除dist下面的entry
        yield file_1.default.removeSync(constant_1.DIST_COMPONENTS_ENTRY);
        console.log(`${chalk_1.default.hex(constant_1.GREEN).bold('build components success')}`);
    }
    catch (err) {
        console.log(err);
    }
});
exports.buildPackage = buildPackage;
