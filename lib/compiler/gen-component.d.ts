import { ObjectType } from '../types';
export declare const genComponentJson: () => Promise<ObjectType>;
export declare const genComponentEntry: () => Promise<void>;
export declare const genComponentVetur: () => Promise<void>;
/**
 * 打包组件
 * 1、将组件打包为esmodule格式
 * 2、将组件打包为commonjs格式
 */
export declare const buildPackage: () => Promise<void>;
