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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckType = exports.ENTRY_EXITS = void 0;
exports.setModuleEnv = setModuleEnv;
exports.existFile = existFile;
exports.joinDir = joinDir;
exports.setFullAssetsDir = setFullAssetsDir;
exports.smartOutputFile = smartOutputFile;
exports.camelCase = camelCase;
exports.pascalCase = pascalCase;
exports.getEarthConfig = getEarthConfig;
exports.removeExt = removeExt;
exports.normalizePath = normalizePath;
exports.getPackageJson = getPackageJson;
exports.hasDefaultExport = hasDefaultExport;
exports.getComponents = getComponents;
exports.assetsPath = assetsPath;
exports.resolveAbsPath = resolveAbsPath;
exports.resolvePathToTarget = resolvePathToTarget;
exports.replaceExt = replaceExt;
exports.syncFunc = syncFunc;
const path_1 = require("path");
const constant_1 = require("../constant");
const fs_extra_1 = require("fs-extra");
exports.ENTRY_EXITS = ['js', 'ts', 'tsx', 'jsx', 'vue'];
const path = require('path');
function setModuleEnv(value) {
    process.env.BABEL_MODULE = value;
}
// 检查数据类型
exports.CheckType = {
    getTypeString(val) {
        return Object.prototype.toString.call(val).toLowerCase();
    },
    isString(val) {
        return this.getTypeString(val) === '[object string]';
    },
    isNumber(val) {
        return this.getTypeString(val) === '[object number]';
    },
    isBoolean(val) {
        return this.getTypeString(val) === '[object boolean]';
    },
    isArray(val) {
        return this.getTypeString(val) === '[object array]';
    },
    isNull(val) {
        return this.getTypeString(val) === '[object null]';
    },
    isUndefined(val) {
        return this.getTypeString(val) === '[object undefined]';
    },
    isFunction(val) {
        return this.getTypeString(val) === '[object function]';
    },
    isObject(val) {
        return this.getTypeString(val) === '[object object]';
    }
};
function existFile(path) {
    return (0, fs_extra_1.existsSync)(path);
}
function joinDir(path) {
    return (0, path_1.join)(constant_1.projectDir, path);
}
/**
 * 将半路径转为全路径, 可接受字符串，数组，对象三种类型
 * @param paths string｜Array｜Object
 * @return string|Array|Object
 */
function setFullAssetsDir(paths) {
    if (exports.CheckType.isString(paths)) {
        return joinDir(paths);
    }
    if (exports.CheckType.isArray(paths)) {
        return paths.map((dir) => {
            if (exports.CheckType.isString(dir) && !(0, path_1.isAbsolute)(dir)) {
                return joinDir(dir);
            }
            if (exports.CheckType.isObject(dir)) {
                return setFullAssetsDir(dir);
            }
            return dir;
        });
    }
    if (exports.CheckType.isObject(paths)) {
        const fullPathObj = {};
        const pathObj = paths;
        for (let key in pathObj) {
            const dir = pathObj[key];
            const val = dir && (0, path_1.isAbsolute)(dir) ? dir : joinDir(dir);
            fullPathObj[key] = val;
        }
        return fullPathObj;
    }
}
// smarter outputFileSync
// skip output if file content unchanged
function smartOutputFile(filePath, content) {
    if ((0, fs_extra_1.existsSync)(filePath)) {
        const previousContent = (0, fs_extra_1.readFileSync)(filePath, 'utf-8');
        if (previousContent === content) {
            return;
        }
    }
    (0, fs_extra_1.outputFileSync)(filePath, content);
}
const camelCaseRE = /-(\w)/g;
const pascalCaseRE = /(\w)(\w*)/g;
// 小驼峰
function camelCase(str) {
    return str.replace(camelCaseRE, (_, c) => c.toUpperCase());
}
// 大驼峰
function pascalCase(str) {
    return camelCase(str).replace(pascalCaseRE, (_, c1, c2) => c1.toUpperCase() + c2);
}
function getEarthConfig() {
    delete require.cache[constant_1.projectDir];
    try {
        return require(constant_1.projectDir);
    }
    catch (err) {
        return {};
    }
}
function removeExt(path) {
    return path.replace('.js', '');
}
function normalizePath(path) {
    return path.replace(/\\/g, '/');
}
function getPackageJson() {
    delete require.cache[constant_1.PACKAGE_JSON_FILE];
    return require(constant_1.PACKAGE_JSON_FILE);
}
function hasDefaultExport(code) {
    return code.includes('export default') || code.includes('export { default }');
}
function getComponents() {
    const EXCLUDES = ['.DS_Store'];
    const dirs = (0, fs_extra_1.readdirSync)(constant_1.srcDir);
    return dirs
        .filter((dir) => !EXCLUDES.includes(dir))
        .filter((dir) => exports.ENTRY_EXITS.some((ext) => {
        const path = (0, path_1.join)(constant_1.srcDir, dir, `index.${ext}`);
        if ((0, fs_extra_1.existsSync)(path)) {
            return hasDefaultExport((0, fs_extra_1.readFileSync)(path, 'utf-8'));
        }
        return false;
    }));
}
function assetsPath(_path) {
    return path.posix.join(_path, `[name].[hash:8].[ext]`);
}
// 将绝对路径path改为相对于dir的相对路径
function resolveAbsPath(path, dir) {
    if (dir && path) {
        const reg = new RegExp(`/${dir}/(.+)`);
        const relPath = path.match(reg);
        return relPath ? `${relPath[1]}` : path;
    }
}
// 根据路径path获取到其中某一层级的相对路径
function resolvePathToTarget(path, target) {
    if (!target || !path) {
        console.error('请传入正确参数');
        return;
    }
    const pathSplit = path.split('/').reverse();
    let isFinish = false;
    return pathSplit.reduce((source, item) => {
        if (item === target) {
            isFinish = true;
            return source;
        }
        if (!isFinish) {
            return `../${source}`;
        }
        return source;
    }, '');
}
function replaceExt(path, ext) {
    const EXT_REGEXP = /\.\w+$/;
    return path.replace(EXT_REGEXP, ext);
}
function syncFunc(fn, ...args) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        yield fn(...args);
        resolve(true);
    }));
}
