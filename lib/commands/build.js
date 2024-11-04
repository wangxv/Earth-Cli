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
const clear_1 = __importDefault(require("./clear"));
const gen_component_1 = require("../compiler/gen-component");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 删除dist文件夹
        yield (0, clear_1.default)();
        console.log(`  ${chalk_1.default.bold('生成组件映射表components.json')}:`);
        yield (0, gen_component_1.genComponentJson)();
        console.log(`  ${chalk_1.default.bold('生成组件入口文件src/components/index.js')}:`);
        yield (0, gen_component_1.genComponentEntry)();
        yield (0, gen_component_1.buildPackage)(); // 打包组件
        console.log(`  ${chalk_1.default.bold('生成组件vetur提示')}:`);
        yield (0, gen_component_1.genComponentVetur)();
    }
    catch (err) {
        err && console.log(chalk_1.default.red(`编译失败：${err.message || err}`));
    }
});
