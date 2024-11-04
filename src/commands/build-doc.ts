import chalk from "chalk";
import { compileDoc } from "../compiler/gen-doc";
import mainConfig from "../config"
import { setFullAssetsDir } from "../utils"
import clear from "./clear";


export default async () => {
  clear([setFullAssetsDir(mainConfig.outputPath)]);
  await compileDoc().catch(({error, warning}) => {
    if (error instanceof Array) {
      error.map((err) => {
        console.log(chalk.red(err));
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
      });
    } else {
      if (error) {
        console.log(chalk.red(error));
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
      }
    }

    warning && console.log(warning);
  });
  console.log('');
  console.log(chalk.cyan(' Build complete.\n'));
}