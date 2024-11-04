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
const fs_extra_1 = require("fs-extra");
class File {
    writeFile(path, content) {
        if ((0, fs_extra_1.existsSync)(path)) {
            const previousContent = (0, fs_extra_1.readFileSync)(path, 'utf-8');
            if (previousContent === path) {
                return;
            }
        }
        (0, fs_extra_1.outputFileSync)(path, content);
    }
    readFile(path) {
        return (0, fs_extra_1.readFileSync)(path, 'utf-8');
    }
    readdirSync(dir) {
        return (0, fs_extra_1.readdirSync)(dir);
    }
    writeJson(json, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonString = JSON.stringify(json);
            yield (0, fs_extra_1.outputFileSync)(path, jsonString);
        });
    }
    removeSync(path) {
        return (0, fs_extra_1.removeSync)(path);
    }
    copySync(path, targetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, fs_extra_1.copySync)(path, targetPath);
        });
    }
    isDir(dir) {
        return (0, fs_extra_1.lstatSync)(dir).isDirectory();
    }
    existsSync(dir) {
        return (0, fs_extra_1.existsSync)(dir);
    }
    mkdirSync(path) {
        return (0, fs_extra_1.mkdirSync)(path);
    }
}
exports.default = new File();
