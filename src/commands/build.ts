import chalk from "chalk";
import clear from './clear';
import { genComponentEntry, genComponentJson, genComponentVetur, buildPackage } from "../compiler/gen-component";

export default async () => {
  try {
    // 删除dist文件夹
    await clear();
    console.log(`  ${chalk.bold('生成组件映射表components.json')}:`);
    await genComponentJson();
    console.log(`  ${chalk.bold('生成组件入口文件src/components/index.js')}:`);
    await genComponentEntry();
    await buildPackage(); // 打包组件
    console.log(`  ${chalk.bold('生成组件vetur提示')}:`);
    await genComponentVetur();
  } catch (err: any) {
    err && console.log(chalk.red(`编译失败：${err.message || err}`))
  }
}