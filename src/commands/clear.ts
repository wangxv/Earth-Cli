import chalk from "chalk";
import { COMPONENTS_ENTRY, COMPONENTS_JSON, DIST } from "../constant";

const rimraf = require('rimraf');

export default (deleteFiles?: string[]) => {
  const files = deleteFiles || [
    COMPONENTS_JSON,
    DIST,
    COMPONENTS_ENTRY
  ];

  console.log(`  ${chalk.bold(`开始删除`)}:`);

  try {
    files.forEach(async (file) => {
      await rimraf.sync(file);
      console.log(`   删除文件：  ${chalk.red(`${file}`)}`);
    })
  } catch (err) {
    err && console.log(err);
  }
}