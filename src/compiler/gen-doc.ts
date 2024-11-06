import webpack from 'webpack';
import prodConfig from '../config/webpack.doc.prod';

export function compileDoc() {
  return new Promise((resolve, reject) => {
    webpack(prodConfig, (err, stats) => {
      if (err || stats?.hasErrors()) {
        let error: any = err;
        let warning: any = null;
        const info: any = stats?.toJson();

        if (stats?.hasErrors()) {
          error = info.errors;
        }

        if (stats?.hasWarnings()) {
          warning = info.warnings;
        }
        reject({error, warning});
      } else {
        resolve(true);
      }
    });
  })
}