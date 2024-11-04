import { Compiler } from 'webpack';
export declare function genSiteDesktop(): void;
export declare function genSiteMobile(): void;
export declare class GenRoutesPlugin {
    apply(compiler: Compiler): void;
}
export declare function compileDoc(): Promise<unknown>;
