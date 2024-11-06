"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileDoc = compileDoc;
const webpack_1 = __importDefault(require("webpack"));
const webpack_doc_prod_1 = __importDefault(require("../config/webpack.doc.prod"));
function compileDoc() {
    return new Promise((resolve, reject) => {
        (0, webpack_1.default)(webpack_doc_prod_1.default, (err, stats) => {
            if (err || (stats === null || stats === void 0 ? void 0 : stats.hasErrors())) {
                let error = err;
                let warning = null;
                const info = stats === null || stats === void 0 ? void 0 : stats.toJson();
                if (stats === null || stats === void 0 ? void 0 : stats.hasErrors()) {
                    error = info.errors;
                }
                if (stats === null || stats === void 0 ? void 0 : stats.hasWarnings()) {
                    warning = info.warnings;
                }
                reject({ error, warning });
            }
            else {
                resolve(true);
            }
        });
    });
}
