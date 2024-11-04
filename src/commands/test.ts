import { runCLI } from 'jest';
import {projectDir, JEST_CONFIG_FILE} from '../constant';

export default (command: any) => {
  process.env.NODE_ENV = 'test';

  const config = {
    rootDir: projectDir,
    config: JEST_CONFIG_FILE,
    watch: command.watch,
    clearCache: command.clearCache
  } as any;

  runCLI(config, [projectDir]).then(response => {
    if (!response.results.success && !command.watch) {
      process.exit(1);
    }
  }).catch(err => {
    console.log(err);
    if (command.watch) {
      process.exit(1);
    }
  })
}