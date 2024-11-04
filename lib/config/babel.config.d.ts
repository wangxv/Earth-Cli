export default function (useESModules?: any): {
    presets: ((string | {
        loose: boolean;
        modules: string | boolean;
        useBuiltIns: boolean;
    })[] | (string | {
        isTSX: boolean;
        allExtension: boolean;
    })[])[];
    plugins: (string | (string | {
        useESModules: any;
    })[] | (string | {
        legacy: boolean;
    })[] | (string | {
        loose: boolean;
    })[])[];
};
