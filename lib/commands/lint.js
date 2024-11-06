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
const execa_1 = __importDefault(require("execa"));
const ora_1 = __importDefault(require("ora"));
const constant_1 = require("../constant");
function runCommand(cmd, options, messages) {
    const spinner = (0, ora_1.default)(messages.start).start();
    return new Promise(resolve => {
        (0, execa_1.default)(cmd, options).then(() => {
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
    return runCommand('eslint', ['./src', '--fix', '--ext', constant_1.SCRIPT_EXTS.join(',')], {
        start: 'Running eslint...',
        succeed: 'ESlint Passed',
        failed: 'ESLint failed!'
    });
}
function stylelint() {
    return runCommand('stylelint', ['src/**/*.css', 'src/**/*.vue', 'src/**/*.less', 'src/**/*.sass', '--fix', constant_1.SCRIPT_EXTS.join(',')], {
        start: 'Running stylelint...',
        succeed: 'stylelint Passed',
        failed: 'stylelint failed!'
    });
}
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const eslintPassed = yield eslint();
    const stylelintPassed = yield stylelint();
    if (!eslintPassed || !stylelintPassed) {
        process.exit(1);
    }
});
