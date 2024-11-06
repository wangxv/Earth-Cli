import execa from 'execa';
import ora from 'ora';
import { SCRIPT_EXTS} from '../constant';

type RunCommandMessage = {
  start: string;
  succeed: string;
  failed: string;
}

function runCommand(cmd: string, options: string[], messages: RunCommandMessage) {
  const spinner = ora(messages.start).start();

  return new Promise(resolve => {
    execa(cmd, options).then(() => {
      spinner.succeed(messages.succeed);
      resolve(true);
    })
    .catch((err) => {
      spinner.fail(messages.failed);
      console.log(err.stdout);
      resolve(false);
    });
  });
}

function eslint() {
  return runCommand(
    'eslint',
    ['./src', '--fix', '--ext', SCRIPT_EXTS.join(',')],
    {
      start: 'Running eslint...',
      succeed: 'ESlint Passed',
      failed: 'ESLint failed!'
    }
  );
}

function stylelint() {
  return runCommand(
    'stylelint',
    ['src/**/*.css', 'src/**/*.vue', 'src/**/*.less', 'src/**/*.sass', '--fix', SCRIPT_EXTS.join(',')],
    {
      start: 'Running stylelint...',
      succeed: 'stylelint Passed',
      failed: 'stylelint failed!'
    }
  );
}

export default async () => {
  const eslintPassed = await eslint();
  const stylelintPassed = await stylelint();

  if (!eslintPassed || !stylelintPassed) {
    process.exit(1);
  }
}