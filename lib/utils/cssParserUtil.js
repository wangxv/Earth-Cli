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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mayBeServerRelativeUrl = mayBeServerRelativeUrl;
exports.isUrlRequestAble = isUrlRequestAble;
exports.requestify = requestify;
exports.normalizeUrl = normalizeUrl;
exports.resolveRequests = resolveRequests;
const loader_utils_1 = require("loader-utils");
const url_1 = require("url");
const path = require('path');
const matchNativeWin32Path = /^[A-Z]:[/\\]|^\\\\/i;
function mayBeServerRelativeUrl(url) {
    if (url.charAt(0) === '/' && !/^\/\//.test(url)) {
        return true;
    }
    return false;
}
function isUrlRequestAble(url) {
    if (matchNativeWin32Path.test(url)) {
        return false;
    }
    if (mayBeServerRelativeUrl(url)) {
        return true;
    }
    if (/^file:/i.test(url)) {
        return true;
    }
    return (0, loader_utils_1.isUrlRequest)(url);
}
function requestify(url, rootContext) {
    if (/^file:/i.test(url)) {
        return (0, url_1.fileURLToPath)(url);
    }
    return mayBeServerRelativeUrl(url)
        ? (0, loader_utils_1.urlToRequest)(url, rootContext)
        : (0, loader_utils_1.urlToRequest)(url);
}
function normalizeUrl(url, isStringValue) {
    let normalizedUrl = url;
    if (isStringValue && /\\[\n]/.test(normalizedUrl)) {
        normalizedUrl = normalizedUrl.replace(/\\[\n]/g, '');
    }
    return decodeURIComponent(unescape(normalizedUrl));
}
function resolveRequests(context, possibleRequests) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return path.resolve(context, possibleRequests[0]);
        }
        catch (e) {
            const [, ...tailPossibleRequests] = possibleRequests;
            if (tailPossibleRequests.length === 0) {
                throw e;
            }
            return resolveRequests(context, tailPossibleRequests);
        }
    });
}
