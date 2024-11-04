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
const chalk_1 = __importDefault(require("chalk"));
const constant_1 = require("../constant");
const rimraf = require('rimraf');
exports.default = (deleteFiles) => {
    const files = deleteFiles || [
        constant_1.COMPONENTS_JSON,
        constant_1.DIST,
        constant_1.COMPONENTS_ENTRY
    ];
    console.log(`  ${chalk_1.default.bold(`开始删除`)}:`);
    try {
        files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
            yield rimraf.sync(file);
            console.log(`   删除文件：  ${chalk_1.default.red(`${file}`)}`);
        }));
    }
    catch (err) {
        err && console.log(err);
    }
};
