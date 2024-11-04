import chalk from 'chalk';
import webpack from 'webpack';
import { getPort } from 'portfinder';
import { ip } from 'address';
import WebpackDevServer from 'webpack-dev-server';
import { GREEN } from '../constant';
import { WebpackConfig } from '../types';
import devConfig from '../config/webpack.doc.dev';

function logServerInfo(port: number, PORT: number) {
  if (port !== PORT) {
    console.log(
      chalk.bgYellow.black('WARNING'),
      chalk.yellow(`Port ${PORT} is already used, ${port} instead\n`)
    );
  }

  const local = `http://localhost:${port}`;
  const network = `http://${ip()}:${port}`;

  console.log('\n doc running at: \n');
  console.log(`  ${chalk.bold('Local')}:    ${chalk.hex(GREEN)(local)} `);
  console.log(`  ${chalk.bold('Network')}:  ${chalk.hex(GREEN)(network)}`);
}

// 起一个服务
function runDevServer(port: number, config: WebpackConfig) {
  const server = new WebpackDevServer(config.devServer, webpack(config));

  // TODO: 可有可无
  // 禁用无线分布式系统状态日志
  (server as any).showStatus = function() {};
  const host = config.devServer!.host || 'localhost';
  console.log('server:', server);

  
  server.server?.listen(port, host, (err?: Error) => {
    if (err) console.log(err);
  });
}


export default () => {
  const PORT: any = devConfig.devServer!.port || 8080;

  getPort({
    port: PORT,
  }, (err, port) => {
    if (err) {
      console.log(err);
      return;
    }
    logServerInfo(port, PORT);
    runDevServer(port, PORT);
  });
}
