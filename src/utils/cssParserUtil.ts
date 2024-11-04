import { urlToRequest, interpolateName, isUrlRequest } from 'loader-utils';
import { fileURLToPath } from 'url';
const path = require('path')

const matchNativeWin32Path = /^[A-Z]:[/\\]|^\\\\/i;

export function mayBeServerRelativeUrl(url) {
  if (url.charAt(0) === '/' && !/^\/\//.test(url)) {
    return true;
  }

  return false;
}

export function isUrlRequestAble(url) {
  if (matchNativeWin32Path.test(url)) {
    return false;
  }

  if (mayBeServerRelativeUrl(url)) {
    return true;
  }

  if (/^file:/i.test(url)) {
    return true;
  }

  return isUrlRequest(url);
}

export function requestify(url, rootContext) {
  if (/^file:/i.test(url)) {
    return fileURLToPath(url);
  }

  return mayBeServerRelativeUrl(url)
    ? urlToRequest(url, rootContext)
    : urlToRequest(url);
}

export function normalizeUrl(url, isStringValue) {
  let normalizedUrl = url;

  if (isStringValue && /\\[\n]/.test(normalizedUrl)) {
    normalizedUrl = normalizedUrl.replace(/\\[\n]/g, '');
  }

  return decodeURIComponent(unescape(normalizedUrl));
}

export async function resolveRequests(context, possibleRequests) {
  try {
    return path.resolve(context, possibleRequests[0])
  } catch(e) {
      const [, ...tailPossibleRequests] = possibleRequests;
      if (tailPossibleRequests.length === 0) {
        throw e;
      }
      return resolveRequests(context, tailPossibleRequests);
  }
}
