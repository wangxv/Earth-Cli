import {join, resolve} from 'path';
import { SyncHook } from 'tapable';
import {rollup} from "rollup";
import chalk from "chalk";
import { ObjectType } from '../types';
import mainConfig, { utilsReg } from '../config';
import file from '../utils/file';
import { COMPONENTS_COMMON_STYLE, COMPONENTS_ENTRY, COMPONENTS_FILE, COMPONENTS_JSON, DIST, DIST_COMPONENTS_COMMON_STYLE, DIST_COMPONENTS_ENTRY, DIST_DIR, GREEN, PACKAGE_JSON_FILE, srcDir, VETUR_DIR } from "../constant";
import { hasDefaultExport, normalizePath, pascalCase, replaceExt, resolveAbsPath, setModuleEnv } from "../utils";
import { createComponentsConfig, createStyleConfig } from '../config/rollup.config';
import { transformAsync } from '@babel/core';
import babelConfig from '../config/babel.config';

const glob = require('glob');
const pkg = require(PACKAGE_JSON_FILE);
const md = require('markdown-it')()
md.use(require('markdown-it-container'), 'props')
md.use(require('markdown-it-container'), 'desc');
const parser = require('posthtml-parser');

interface GenContentParams {
  pathResolver: (path: string, key: string) => (any); // path: 需要解析的路径，key: 导出组件名称
}
interface Tags {
  [key: string]: {
    description?: string;
    attributes?: string[];
  }
}
interface Attributes {
  [key: string]: {
    description?: string;
  }
}

// 生成组件映射表
export const genComponentJson = async (): Promise<ObjectType> => {
  return new Promise(async (resolve, reject) => {
    const { componentsPath } = mainConfig;
    const entryJson: ObjectType = {};

    glob(`*/index.@(js|ts|tsx|jsx|vue)`,
      {
        cwd: `${componentsPath}`,
        nodir: true
      },
      (err: Error | null, files: string[]) => {
        if (err) reject(err);

        files.map(async (path: string) => {
          const fullPath = join(componentsPath, path);
          const fileName = path.split('/')[0];

          if (entryJson[fileName]) {
            reject(`一个组件只允许有一个入口文件，${fileName}有多个`);
          } else {
            entryJson[fileName] = fullPath;
          }
        });
        console.log('组件文件映射表：', entryJson);

        file.writeJson(entryJson, COMPONENTS_JSON);
        resolve(entryJson);
      }
    )
  });
}

// 拼凑组件引入代码
const genImport = (entries: Array<string | any[]>) => {
  return entries.map(([key, value]) => {
    return (`import ${key} from '${value}';`);
  }).concat().join('\n');
};

// 拼凑组件导出代码
const genExport = (entries: Array<string | any[]>) => {
  return entries.map(([key]) => (key).join(',\n'));
};

// 拼凑组件
const genContent = ({pathResolver}: GenContentParams) => {
  const version = `${pkg.version}`;
  const components: ObjectType = require(COMPONENTS_JSON) || {};
  const allEntry = Object.assign({}, components);

  const entries = Object.entries(allEntry)
    .filter(([, value]) => {
      if (value) return hasDefaultExport(file.readFile(value));
    })
    .map(([key, value]) => {
      key = `Ea${pascalCase(key)}`; // 拼组件前缀 EaRadioGroup
      const pathValue = pathResolver(value, key);
      return [key, pathValue];
    });

  const content = `
    ${genImport(entries)}
    const version = '${version}';
    const components = [
      ${genExport(entries)}
    ];
    function install(app) {
      components.forEach(item => {
        if (item.install) {
          app.use(item);
        } else if (item.name) {
          app.component(item.name, item); 
        }
      });
    }

    export {
      ${genExport(entries)}
    }

    export default {
      install,
      version
    }
  `;

  return content;
}

// 生成组件入口文件
export const genComponentEntry = async() => {
  const originEntryContent = genContent({
    pathResolver: (path) => {
      return `./${resolveAbsPath(normalizePath(path), 'components')}`;
    }
  });
  await file.writeFile(COMPONENTS_ENTRY, originEntryContent);
  console.log(`生成${COMPONENTS_ENTRY}成功`);

  const distEntryContent = genContent({
    pathResolver: (path, key) => {
      return `./${key}/index`;
    }
  });
  await file.writeFile(DIST_COMPONENTS_ENTRY, distEntryContent);

  console.log(`生成${DIST_COMPONENTS_ENTRY}成功`);
}

class VeturParser {
  tags: Tags = {};
  attributes: Attributes = {};
  currentTag: string = '';
  hooks = {
    // @ts-ignore
    className: new SyncHook(['node', 'className']),
    // @ts-ignore
    tag: new SyncHook(['node', 'tag']),
    text: new SyncHook(['node']),
  };

  constructor() {
    this.tags = {};
    this.attributes = {};
    this.currentTag = '';
  }


  processValue(content) {
    if (!content || !content.length) return '';
    let str = '';
    content.forEach(node => {
      if (typeof node !== 'string') {
        str += node.content[0];
      } else {
        str += node;
      }
    });

    return str;
  }

  // 赋初始值
  generateTag() {
    if (this.tags[this.currentTag]) return;
    this.tags[this.currentTag] = {};
  }

  // 属性赋值
  generateAttributes(attr, desc) {
    this.attributes[`${this.currentTag}/${attr}`] = {
      description: desc
    };
    if (this.tags[this.currentTag]) {
      this.tags[this.currentTag].attributes ? this.tags[this.currentTag].attributes!.push(attr) : (this.tags[this.currentTag].attributes = [attr]);
    } else {
      this.tags[this.currentTag] = {
        attributes: [attr]
      };
    }
  }

  generateDescription(desc) {
    if (this.tags[this.currentTag]) {
      this.tags[this.currentTag].description = desc;
    } else {
      this.tags[this.currentTag] = { description: desc };
    }
  }

  initCallback() {
    let propsNode = null;
    let descNode = null;
    this.applyEvents({
      ClassName: (node, className) => {
        if (className === 'props') {
          propsNode = node;
        }
        if (className === 'desc') {
          descNode = node;
        }
      },
      Tag: (node, tag) => {
        if (tag === 'tbody' && propsNode) {
          const trList = node.content.filter(item => item.tag === 'tr');

          trList.forEach(item => {
            const tdList = item.content.filter(item => item.tag === 'td');

            if (tdList[0] && trList[0].content) {
              const attr = this.processValue(tdList[0].content);
              const desc = this.processValue(tdList[1].content);

              this.generateAttributes(attr, desc);
            }
          });
          propsNode = null;
          if (tag === 'p' && descNode) {
            this.generateDescription(this.processValue(node.content));
            descNode = null;
          }
        }
      }
    })
  }

  // 监控hook
  applyEvents(tapCallback) {
    this.hooks.className.tap('className', tapCallback.ClassName);
    this.hooks.text.tap('text', tapCallback.Text);
    this.hooks.tag.tap('tag', tapCallback.Tag);
  }

  traverse(ast) {
    ast.forEach(node => {
      if (typeof node === 'object') {
        if (node.attrs && node.attrs.class) {
          // @ts-ignore
          this.hooks.className.call(node, node.attrs.class);
        }
        if (node.tag) {
          // @ts-ignore
          this.hooks.tag.call(node, node.tag);
        }
      } else {
        this.hooks.text.call(node);
      }
      node.content && this.traverse(node.content);
    })
  }

  compile() {
    const fileList = file.readdirSync(COMPONENTS_FILE);
    this.initCallback();
    fileList.forEach(fileItem => {
      const readme = resolve(COMPONENTS_ENTRY, `./${fileItem}/README.md`);
      if (file.existsSync(readme)) {
        const content = file.readFile(readme).toString();
        const result = md.render(content);
        const ast = parser(result);

        this.currentTag = 'ea-' + fileItem;
        this.traverse(ast);
      }
    });
  }

  emit() {
    if (!file.existsSync(VETUR_DIR)) {
      file.mkdirSync(VETUR_DIR);
    }

    file.writeFile(resolve(VETUR_DIR, 'attributes.json'), JSON.stringify(this.attributes));
    file.writeFile(resolve(VETUR_DIR, 'tags.json'), JSON.stringify(this.tags));
  }

  run() {
    this.compile();
    this.emit();
  }
}
export const genComponentVetur = async() => {
  const parser = new VeturParser();
  parser.run();
}


/**
 * rollup打包组件
 * 
 */
function compileJs(filePath: string, shouldRemove: boolean, targetFilePath?: string): Promise<undefined>{
  return new Promise((resolve, reject) => {
    let code = file.readFile(filePath);
    if (utilsReg.test(code)) {
      reject(`${filePath}文件中，请将'@/utils'替换为非alias写法`)
    }
    transformAsync(code, {
      filename: filePath,
      babelrc: false,
      ...babelConfig()
    })
    .then((result: any) => {
      if (result) {
        const finalFilePath = targetFilePath ? targetFilePath : replaceExt(filePath, '.js');
        if (shouldRemove) {
          file.removeSync(filePath);
        }
        file.writeFile(finalFilePath, result.code);
        resolve(undefined);
      }
    })
  })
}

async function compileDir(dirPath: string, shouldRemove:boolean, targetDirPath?: string): Promise<any> {
  const files = file.readdirSync(dirPath);
  return Promise.all(files.map((filename) => {
    const filePath = join(dirPath, filename);
    const targetFilePath = targetDirPath ? join(targetDirPath, filename) : undefined;
    if (file.isDir(filePath)) {
      return compileDir(filePath, shouldRemove, targetFilePath);
    }
    return compileJs(filePath, shouldRemove, targetFilePath);
  })).catch((err) => {
    console.log(chalk.red(err));
    process.exit(1);
  })
}

async function compileUtils () {
  const COMPONENTS_UTILS = join(srcDir, mainConfig.utilsFileName); // 组件库utils
  const DIST_ESM_COMPONENTS_UTILS = join(DIST, `esm/${mainConfig.utilsFileName}`); // dist/esm组件库utils
  const DIST_LIB_COMPONENTS_UTILS = join(DIST, `lib/${mainConfig.utilsFileName}`); // dist/lib组件库utils
  const useESModules = process.env.BABEL_MODULE !== 'commonjs';
  const distPath = useESModules ? DIST_ESM_COMPONENTS_UTILS : DIST_LIB_COMPONENTS_UTILS
  await file.copySync(COMPONENTS_UTILS, distPath);
  await compileDir(distPath, true);
}

const genStyleImport = () => {
  const components: ObjectType = require(COMPONENTS_JSON) || {};
  return Object.keys(components)
  .map((name) => {
    const key = 'Ea' + pascalCase(name);
    return (`@import './${key}/index.css';`);
  }).concat().join('\n');
};

const compileStyle = async (entry, shouldRemove?, outputPath?) => {
  try {
    const config = createStyleConfig(entry, outputPath);
    const bundle = await rollup(config);
    await bundle.write(config.output);
    if (shouldRemove) {
      file.removeSync(entry);
    }
    const filename = config.output.file;
    console.log(`${chalk.hex(GREEN)(filename)}`);
  } catch(err) {
    console.log(err);
  }
}

const compileStyleDir = async(dirPath, shouldRemove, targetDirPath?) => {
  const files = file.readdirSync(dirPath);
  return Promise.all(files.map((filename) => {
    const filePath = join(dirPath, filename);
    replaceExt(filePath, '.css');
    const targetFilePath = targetDirPath ? join(targetDirPath, filename) : filePath;
    if (file.isDir(filePath)) {
      return compileStyle(filePath, shouldRemove, targetFilePath);
    }
    compileStyle(filePath, shouldRemove, targetFilePath);
  })).catch((err) => {
    console.log(chalk.red(err));
    process.exit(1);
  });
}


const addStyleToComponent = async (env) => {
  const dirPath = join(DIST_DIR, env);
  const files = file.readdirSync(dirPath);
  const commonStyle = ['base.css'];
  const content = commonStyle.map((common) => {
    return (`import '../../style/${common}';`)
  }).concat([`import '../index.css';`]).join('\n');

  files.map(filename => {
    if (/^Ea/.test(filename)) {
      const filePath = join(dirPath, filename);
      const targetStyleDir = join(filePath, 'style/index.js');
      file.writeFile(targetStyleDir, content);
    }
  })
};

const genComponentStyle = async () => {
  try {
    // 编译common style
    if (file.existsSync(COMPONENTS_COMMON_STYLE)) {
      const useESModules = process.env.BABEL_MODULE !== 'commonjs';
      const env = useESModules ? 'esm' : 'lib';
      const distPath = DIST_COMPONENTS_COMMON_STYLE(env);
      await file.copySync(COMPONENTS_COMMON_STYLE, distPath)
      await compileStyleDir(distPath, true);
    }
  } catch(err) {
    console.log(err);
  }
}

async function genEntryStyle() {
  try {
    const content = genStyleImport();
    const env = process.env.BABEL_MODULE !== 'commonjs' ? 'esm' : 'lib';
    const filePath = `${DIST_DIR}/${env}/index.less`;

    await file.writeFile(filePath, content);
    compileStyle(filePath);
    await genComponentStyle();
    addStyleToComponent(env);

  } catch (err) {
    console.log(err);
  }
}

/**
 * 使用rollup打包
 * @param format 打包类型
 */
const compilePackage = async (format: 'es' | 'cjs') => {
  const configs = createComponentsConfig(format);
  await Promise.all(configs.map(async(config: any) => {
    const bundle = await rollup(config);
    await bundle.write(config.output);
    const fileName = config.output.file;
    console.log(`${chalk.hex(GREEN)(fileName)}`);
  }));
}

/**
 * 打包组件
 * 1、将组件打包为esmodule格式
 * 2、将组件打包为commonjs格式
 */
export const buildPackage = async () => {
  try {
    const pkg = require(PACKAGE_JSON_FILE);
    const esDist = pkg.module ? pkg.module : 'dist/esm/index.es.js';
    const libDist = pkg.main ? pkg.main : 'dist/lib/index.lib.js';
    console.log(`${chalk.bold('开始编译es文件')}:`);
    setModuleEnv('esmodule');
    const _start = new Date().getTime();
    await compilePackage('es');
    await compileJs(DIST_COMPONENTS_ENTRY, false, esDist);
    await compileUtils();
    await genEntryStyle();
    const _end = new Date().getTime();
    console.log(`编译es耗时${chalk.red(_end - _start)}:`);

    console.log(`${chalk.bold('开始编译lib文件')}:`);
    setModuleEnv('commonjs');
    await compilePackage('cjs');
    await compileJs(DIST_COMPONENTS_ENTRY, false, libDist);
    await compileUtils();
    await genEntryStyle();

    // 删除dist下面的entry
    await file.removeSync(DIST_COMPONENTS_ENTRY);
    console.log(`${chalk.hex(GREEN).bold('build components success')}`);
  } catch (err) {
    console.log(err);
  }
}
