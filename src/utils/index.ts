import {isAbsolute, join} from 'path';
import {srcDir, projectDir, PACKAGE_JSON_FILE} from '../constant';
import {ObjectType} from '../types';
import {readdirSync, existsSync, readFileSync, outputFileSync} from 'fs-extra'
export const ENTRY_EXITS = ['js', 'ts', 'tsx', 'jsx', 'vue'];
const path = require('path')
export type ModuleEnv = 'esmodule' | 'commonjs';
export function setModuleEnv(value: ModuleEnv) {
  process.env.BABEL_MODULE = value;
}
// 检查数据类型
export const CheckType = {
  getTypeString(val: any) {
    return Object.prototype.toString.call(val).toLowerCase()
  },
  isString(val: any) {
    return this.getTypeString(val) === '[object string]'
  },
  isNumber(val: any) {
    return this.getTypeString(val) === '[object number]'
  },
  isBoolean(val: any) {
    return this.getTypeString(val) === '[object boolean]'
  },
  isArray(val: any) {
    return this.getTypeString(val) === '[object array]'
  },
  isNull(val: any) {
    return this.getTypeString(val) === '[object null]'
  },
  isUndefined(val: any) {
    return this.getTypeString(val) === '[object undefined]'
  },
  isFunction(val: any) {
    return this.getTypeString(val) === '[object function]'
  },
  isObject(val: any) {
    return this.getTypeString(val) === '[object object]'
  }
};
export function existFile(path: string) {
  return existsSync(path)
}
export function joinDir(path: string) {
  return join(projectDir, path);
}

/**
 * 将半路径转为全路径, 可接受字符串，数组，对象三种类型
 * @param paths string｜Array｜Object
 * @return string|Array|Object
 */
export function setFullAssetsDir(paths: string | Array<any> | ObjectType) : any {
  if (CheckType.isString(paths)) {
    return joinDir(paths as string);
  }
  if (CheckType.isArray(paths)) {
    return (paths as Array<any>).map((dir) => {
      if (CheckType.isString(dir) && !isAbsolute(dir)) {
        return joinDir(dir);
      }
      if (CheckType.isObject(dir)) {
        return setFullAssetsDir(dir);
      }
      return dir;
    })
  }
  if (CheckType.isObject(paths)) {
    const fullPathObj: ObjectType = {};
    const pathObj = paths as ObjectType;
    for (let key in pathObj) {
      const dir = pathObj[key];
      const val = dir && isAbsolute(dir) ? dir : joinDir(dir);
      fullPathObj[key] = val;
    }
    return fullPathObj;
  }
}

// smarter outputFileSync
// skip output if file content unchanged
export function smartOutputFile(filePath: string, content: string) {
  if (existsSync(filePath)) {
    const previousContent = readFileSync(filePath, 'utf-8');

    if (previousContent === content) {
      return;
    }
  }
 outputFileSync(filePath, content);
}


const camelCaseRE = /-(\w)/g;
const pascalCaseRE = /(\w)(\w*)/g;

// 小驼峰
export function camelCase(str: string): string {
  return str.replace(camelCaseRE, (_, c) => c.toUpperCase());
}

// 大驼峰
export function pascalCase(str: string): string {
  return camelCase(str).replace(
    pascalCaseRE,
    (_, c1, c2) => c1.toUpperCase() + c2
  );
}

export function getEarthConfig() {
  delete require.cache[projectDir];

  try {
    return require(projectDir);
  } catch (err) {
    return {};
  }
}

export function removeExt(path: string) {
  return path.replace('.js', '');
}

export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

export function getPackageJson() {
  delete require.cache[PACKAGE_JSON_FILE];

  return require(PACKAGE_JSON_FILE);
}


export function hasDefaultExport(code: string) {
  return code.includes('export default') || code.includes('export { default }');
}

export function getComponents() {
  const EXCLUDES = ['.DS_Store'];
  const dirs = readdirSync(srcDir);
  return dirs
  .filter((dir: string) => !EXCLUDES.includes(dir))
  .filter((dir: string) =>
    ENTRY_EXITS.some((ext: string) => {
      const path = join(srcDir, dir, `index.${ext}`);
      if (existsSync(path)) {
        return hasDefaultExport(readFileSync(path, 'utf-8'));
      }

      return false;
    })
  );
}

export function assetsPath (_path: string) {
  return path.posix.join(_path, `[name].[hash:8].[ext]`);
}

// 将绝对路径path改为相对于dir的相对路径
export function resolveAbsPath(path: string, dir: string) {
  if (dir && path) {
    const reg = new RegExp(`/${dir}/(.+)`)
    const relPath = path.match(reg);
    return relPath ? `${relPath[1]}` : path;
  }
}

// 根据路径path获取到其中某一层级的相对路径
export function resolvePathToTarget(path, target) {
  if (!target || !path) {
    console.error('请传入正确参数');
    return;
  }
  const pathSplit = path.split('/').reverse();
  let isFinish = false;
  return pathSplit.reduce((source, item) => {
    if (item === target) {
      isFinish = true
      return source;
    }
    if (!isFinish) {
      return `../${source}`
    }
    return source;
  }, '')
}

export function replaceExt(path: string, ext: string) {
  const EXT_REGEXP = /\.\w+$/;
  return path.replace(EXT_REGEXP, ext);
}

export function syncFunc(fn, ...args) {
  return new Promise(async (resolve, reject) => {
    await fn(...args);
    resolve(true);
  })
}

