"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const gen_doc_1 = require("../compiler/gen-doc");
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const clear_1 = __importDefault(require("./clear"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, clear_1.default)([(0, utils_1.setFullAssetsDir)(config_1.default.outputPath)]);
    yield (0, gen_doc_1.compileDoc)().catch(({ error, warning }) => {
        if (error instanceof Array) {
            error.map((err) => {
                console.log(chalk_1.default.red(err));
                console.log(chalk_1.default.red('  Build failed with errors.\n'));
                process.exit(1);
            });
        }
        else {
            if (error) {
                console.log(chalk_1.default.red(error));
                console.log(chalk_1.default.red('  Build failed with errors.\n'));
                process.exit(1);
            }
        }
        warning && console.log(warning);
    });
    console.log('');
    console.log(chalk_1.default.cyan(' Build complete.\n'));
});
