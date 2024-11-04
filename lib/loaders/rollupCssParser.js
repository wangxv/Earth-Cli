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
const postcss_1 = __importDefault(require("postcss"));
const postcss_value_parser_1 = __importDefault(require("postcss-value-parser"));
const cssParserUtil_1 = require("../utils/cssParserUtil");
const pluginName = 'postcss-import-parser';
function walkAtRules(css, result, options, callback) {
    const accumulator = [];
    css.walkAtRules(/^import$/i, (atRule) => {
        // Convert only top-level @import
        if (atRule.parent.type !== 'root') {
            return;
        }
        // Nodes do not exists - `@import url('http://') :root {}`
        if (atRule.nodes) {
            result.warn("It looks like you didn't end your @import statement correctly. Child nodes are attached to it.", { node: atRule });
            return;
        }
        const { nodes: paramsNodes } = (0, postcss_value_parser_1.default)(atRule.params);
        // No nodes - `@import ;`
        // Invalid type - `@import foo-bar;`
        if (paramsNodes.length === 0 ||
            (paramsNodes[0].type !== 'string' && paramsNodes[0].type !== 'function')) {
            result.warn(`Unable to find uri in "${atRule.toString()}"`, {
                node: atRule,
            });
            return;
        }
        let isStringValue;
        let url;
        if (paramsNodes[0].type === 'string') {
            isStringValue = true;
            url = paramsNodes[0].value;
        }
        else {
            // Invalid function - `@import nourl(test.css);`
            if (paramsNodes[0].value.toLowerCase() !== 'url') {
                result.warn(`Unable to find uri in "${atRule.toString()}"`, {
                    node: atRule,
                });
                return;
            }
            isStringValue =
                paramsNodes[0].nodes.length !== 0 &&
                    paramsNodes[0].nodes[0].type === 'string';
            url = isStringValue
                ? paramsNodes[0].nodes[0].value
                : postcss_value_parser_1.default.stringify(paramsNodes[0].nodes);
        }
        // Empty url - `@import "";` or `@import url();`
        if (url.trim().length === 0) {
            result.warn(`Unable to find uri in "${atRule.toString()}"`, {
                node: atRule,
            });
            return;
        }
        accumulator.push({
            atRule,
            url,
            isStringValue,
            mediaNodes: paramsNodes.slice(1),
        });
    });
    callback && callback(null, accumulator);
    return accumulator;
}
// @ts-ignore
const cssImportParser = postcss_1.default.plugin(pluginName, (options) => {
    return (css, result) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedResults = walkAtRules(css, result, options);
        if (parsedResults.length === 0) {
            return Promise.resolve();
        }
        for (const parsedResult of parsedResults) {
            const { atRule, url, isStringValue, mediaNodes } = parsedResult;
            let normalizedUrl = url;
            const isRequestAble = (0, cssParserUtil_1.isUrlRequestAble)(normalizedUrl);
            if (isRequestAble) {
                normalizedUrl = (0, cssParserUtil_1.normalizeUrl)(normalizedUrl, isStringValue);
                if (normalizedUrl.trim().length === 0) {
                    result.warn(`Unable to find uri in "${atRule.toString()}"`, {
                        node: atRule,
                    });
                    continue;
                }
            }
            if (isRequestAble) {
                const request = (0, cssParserUtil_1.requestify)(normalizedUrl, options.rootContext);
                atRule.params = `url(${request})`;
            }
            else {
                atRule.params = url;
            }
        }
    });
});
exports.default = cssImportParser;
