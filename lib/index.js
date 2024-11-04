#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const start_1 = __importDefault(require("./commands/start"));
const clear_1 = __importDefault(require("./commands/clear"));
const lint_1 = __importDefault(require("./commands/lint"));
const build_1 = __importDefault(require("./commands/build"));
const build_doc_1 = __importDefault(require("./commands/build-doc"));
const program = new commander_1.Command();
program.version = package_json_1.default.version;
program.command('start').description('文档项目启动').action(start_1.default);
program.command('build').description('打包组件').action(build_1.default);
program.command('build-doc').description('打包文档').action(build_doc_1.default);
program.command('lint').description('启动eslint检查').action(lint_1.default);
program.command('clear').description('清除').action(clear_1.default);
// program.command('test')
// .description('组件测试')
// .option(
//   '--watch',
//   '监控文件更改并对修改后的测试文件'
// )
// .option(
//   '--clearCache',
//   '清除jest缓存'
// )
// .action(test);
program.parse();
