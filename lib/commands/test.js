"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_1 = require("jest");
const constant_1 = require("../constant");
exports.default = (command) => {
    process.env.NODE_ENV = 'test';
    const config = {
        rootDir: constant_1.projectDir,
        config: constant_1.JEST_CONFIG_FILE,
        watch: command.watch,
        clearCache: command.clearCache
    };
    (0, jest_1.runCLI)(config, [constant_1.projectDir]).then(response => {
        if (!response.results.success && !command.watch) {
            process.exit(1);
        }
    }).catch(err => {
        console.log(err);
        if (command.watch) {
            process.exit(1);
        }
    });
};
