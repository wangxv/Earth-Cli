"use strict";
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
exports.GenRoutesPlugin = void 0;
exports.genSiteDesktop = genSiteDesktop;
exports.genSiteMobile = genSiteMobile;
exports.compileDoc = compileDoc;
const webpack_1 = __importDefault(require("webpack"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utils_1 = require("../utils");
const constant_1 = require("../constant");
const webpack_doc_prod_1 = __importDefault(require("../config/webpack.doc.prod"));
const config_1 = __importDefault(require("../config"));
const { componentsSrc } = config_1.default;
const PLUGIN_NAME = 'GenDesktopRoutesPlugin';
function formatName(component) {
    return (0, utils_1.pascalCase)(component);
}
/**
 * 获取所有readme文件并保存为数组
 * @param components
 */
function resolveDocuments(components) {
    const docs = [];
    components.forEach(component => {
        if ((0, fs_extra_1.lstatSync)(`${componentsSrc}/${component}`).isDirectory()) {
            docs.push({
                name: formatName(component),
                path: (0, path_1.join)(constant_1.COMPONENTS_FILE, component, 'README.md'),
            });
        }
    });
    return [...docs.filter(item => (0, fs_extra_1.existsSync)(item.path))];
}
function genImportDocuments(items) {
    return items.map(item => `import ${item.name} from '${(0, utils_1.normalizePath)(item.path)}';`).join('\n');
}
function genExportDocuments(items) {
    return `export const documents = {
  ${items.map(item => item.name).join(',\n  ')}
};`;
}
function genSiteDesktop() {
    const dirs = (0, fs_extra_1.readdirSync)(componentsSrc);
    const documents = resolveDocuments(dirs);
    const code = `
${genImportDocuments(documents)}
${genExportDocuments(documents)}
`;
    (0, utils_1.smartOutputFile)(constant_1.ROUTES_FILE, code);
}
function genImports(items) {
    return items.map(item => `import ${item.name} from '${(0, utils_1.normalizePath)(item.path)}';`).join('\n');
}
function genExports(items) {
    return `export const documents = {
  ${items.map(item => item.name).join(',\n  ')}
};`;
}
function genSiteMobile() {
    const dirs = (0, fs_extra_1.readdirSync)(componentsSrc);
    const demos = dirs.map(component => ({
        component,
        name: (0, utils_1.pascalCase)(component),
        path: (0, path_1.join)(constant_1.COMPONENTS_FILE, component, 'demo/index.vue'),
    })).filter(item => (0, fs_extra_1.existsSync)(item.path));
    const code = `
    ${genImports(demos)}
  ${genExports(demos)}
`;
    (0, utils_1.smartOutputFile)(constant_1.MOBILE_ROUTES_FILE, code);
}
function genSiteEntry() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            genSiteDesktop();
            genSiteMobile();
            resolve();
        });
    });
}
class GenRoutesPlugin {
    apply(compiler) {
        compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, genSiteEntry);
    }
}
exports.GenRoutesPlugin = GenRoutesPlugin;
function compileDoc() {
    return new Promise((resolve, reject) => {
        (0, webpack_1.default)(webpack_doc_prod_1.default, (err, stats) => {
            if (err || (stats === null || stats === void 0 ? void 0 : stats.hasErrors())) {
                let error = err;
                let warning = null;
                const info = stats === null || stats === void 0 ? void 0 : stats.toJson();
                if (stats === null || stats === void 0 ? void 0 : stats.hasErrors()) {
                    error = info.errors;
                }
                if (stats === null || stats === void 0 ? void 0 : stats.hasWarnings()) {
                    warning = info.warnings;
                }
                reject({ error, warning });
            }
            else {
                resolve(true);
            }
        });
    });
}
