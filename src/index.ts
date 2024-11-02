#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';

const program = new Command();
program.version = packageJson.version;

program.command('start').description('文档项目启动').action(start);
program.command('build').description('打包组件').action(build);
// program.command('build-doc').description('打包文档').action(buildDoc);
// program.command('lint').description('启动eslint检查').action(lint);
// program.command('clear').description('清除').action(clear);
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
