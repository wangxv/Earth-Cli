import { ObjectType } from "../types";
declare class File {
    writeFile(path: string, content: string): void;
    readFile(path: string): any;
    readdirSync(dir: string): any;
    writeJson(json: ObjectType, path: string): Promise<void>;
    removeSync(path: string): any;
    copySync(path: string, targetPath: string): Promise<void>;
    isDir(dir: string): any;
    existsSync(dir: string): any;
    mkdirSync(path: string): any;
}
declare const _default: File;
export default _default;
