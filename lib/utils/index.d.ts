import { ObjectType } from '../types';
export declare const ENTRY_EXITS: string[];
export type ModuleEnv = 'esmodule' | 'commonjs';
export declare function setModuleEnv(value: ModuleEnv): void;
export declare const CheckType: {
    getTypeString(val: any): string;
    isString(val: any): boolean;
    isNumber(val: any): boolean;
    isBoolean(val: any): boolean;
    isArray(val: any): boolean;
    isNull(val: any): boolean;
    isUndefined(val: any): boolean;
    isFunction(val: any): boolean;
    isObject(val: any): boolean;
};
export declare function existFile(path: string): any;
export declare function joinDir(path: string): string;
/**
 * 将半路径转为全路径, 可接受字符串，数组，对象三种类型
 * @param paths string｜Array｜Object
 * @return string|Array|Object
 */
export declare function setFullAssetsDir(paths: string | Array<any> | ObjectType): any;
export declare function smartOutputFile(filePath: string, content: string): void;
export declare function camelCase(str: string): string;
export declare function pascalCase(str: string): string;
export declare function getEarthConfig(): any;
export declare function removeExt(path: string): string;
export declare function normalizePath(path: string): string;
export declare function getPackageJson(): any;
export declare function hasDefaultExport(code: string): boolean;
export declare function getComponents(): any;
export declare function assetsPath(_path: string): any;
export declare function resolveAbsPath(path: string, dir: string): string | undefined;
export declare function resolvePathToTarget(path: any, target: any): any;
export declare function replaceExt(path: string, ext: string): string;
export declare function syncFunc(fn: any, ...args: any[]): Promise<unknown>;
