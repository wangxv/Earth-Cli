// 文件读取操作
import { ObjectType } from "../types";
import {
  existsSync,
  readFileSync,
  outputFileSync, removeSync, copySync, lstatSync, readdirSync,
  mkdirSync
} from 'fs-extra';
class File {
  writeFile(path: string, content: string) {
    if (existsSync(path)) {
      const previousContent = readFileSync(path, 'utf-8');
      if (previousContent === path) {
        return;
      }
    }
    outputFileSync(path, content);
  }
  readFile(path: string) {
    return readFileSync(path, 'utf-8');
  }
  readdirSync(dir: string) {
    return readdirSync(dir);
  }
  async writeJson(json: ObjectType, path: string) {
    const jsonString = JSON.stringify(json);
    await outputFileSync(path, jsonString);
  }
  removeSync(path: string) {
    return removeSync(path);
  }
  async copySync(path: string, targetPath: string) {
    await copySync(path, targetPath);
  }
  isDir(dir: string) {
    return lstatSync(dir).isDirectory();
  }
  existsSync(dir: string) {
    return existsSync(dir);
  }
  mkdirSync(path: string) {
    return mkdirSync(path);
  }
}

export default new File();
