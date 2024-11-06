import { Compiler } from 'webpack';
import { join } from 'path';
import { existsSync, readdirSync, lstatSync } from 'fs-extra';
import {
  pascalCase,
  smartOutputFile,
  normalizePath,
} from '../utils';
import { ROUTES_FILE, MOBILE_ROUTES_FILE, COMPONENTS_FILE } from "../constant";
import mainConfig from '../config'
const { componentsSrc } = mainConfig;
const PLUGIN_NAME = 'GenDesktopRoutesPlugin';

type DocumentItem = {
  name: string;
  path: string;
};

type DemoItem = {
  name: string;
  path: string;
  component: string;
};


function formatName(component: string) {
  return pascalCase(component);
}

/**
 * 获取所有readme文件并保存为数组
 * @param components
 */
function resolveDocuments(components: string[]): DocumentItem[] {
  const docs: DocumentItem[] = [];
  components.forEach(component => {
    if (lstatSync(`${componentsSrc}/${component}`).isDirectory()) {
      docs.push({
        name: formatName(component),
        path: join(COMPONENTS_FILE, component, 'README.md'),
      });
    }
  });

  return [...docs.filter(item => existsSync(item.path))];
}

function genImportDocuments(items: DocumentItem[]) {
  return items.map(item => `import ${ item.name } from '${ normalizePath(item.path) }';`).join('\n');
}

function genExportDocuments(items: DocumentItem[]) {
  return `export const documents = {
  ${ items.map(item => item.name).join(',\n  ') }
};`;
}

export function genPcDesktop() {
  const dirs = readdirSync(componentsSrc);
  const documents = resolveDocuments(dirs);
  const code = `
${ genImportDocuments(documents) }
${ genExportDocuments(documents) }
`;
  smartOutputFile(ROUTES_FILE, code);
}

function genImports(items: DemoItem[]) {
  return items.map(item => `import ${ item.name } from '${ normalizePath(item.path) }';`).join('\n');
}


function genExports(items: DemoItem[]) {
  return `export const documents = {
  ${ items.map(item => item.name).join(',\n  ') }
};`;
}

export function genSiteMobile() {
  const dirs = readdirSync(componentsSrc);
  const demos = dirs.map(component => ({
    component,
    name: pascalCase(component),
    path: join(COMPONENTS_FILE, component, 'demo/index.vue'),
  })).filter(item => existsSync(item.path));
  const code = `
    ${ genImports(demos) }
  ${ genExports(demos) }
`;
  smartOutputFile(MOBILE_ROUTES_FILE, code);
}

async function genSiteEntry(): Promise<void> {
  return new Promise(resolve => {
    genPcDesktop();
    genSiteMobile()
    resolve()
  })
}

export class GenRoutesPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, genSiteEntry);
  }
}