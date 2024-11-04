declare const createComponentsConfig: (format: "es" | "cjs") => any;
declare const createStyleConfig: (entry: any, outputPath: any) => {
    input: any;
    plugins: import("rollup").Plugin<any>[];
    output: {
        file: any;
    };
};
export { createComponentsConfig, createStyleConfig };
