import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import {isUrlRequestAble, normalizeUrl, requestify} from '../utils/cssParserUtil';

const pluginName = 'postcss-import-parser';

function walkAtRules(css, result, options, callback?) {
  const accumulator: any[] = [];

  css.walkAtRules(/^import$/i, (atRule) => {
    // Convert only top-level @import
    if (atRule.parent.type !== 'root') {
      return;
    }

    // Nodes do not exists - `@import url('http://') :root {}`
    if (atRule.nodes) {
      result.warn(
        "It looks like you didn't end your @import statement correctly. Child nodes are attached to it.",
        { node: atRule }
      );
      return;
    }

    const { nodes: paramsNodes } = valueParser(atRule.params);

    // No nodes - `@import ;`
    // Invalid type - `@import foo-bar;`
    if (
      paramsNodes.length === 0 ||
      (paramsNodes[0].type !== 'string' && paramsNodes[0].type !== 'function')
    ) {
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
    } else {
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
        : valueParser.stringify(paramsNodes[0].nodes);
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
const cssImportParser = postcss.plugin(pluginName, (options) => {
  return async (css, result) => {
    const parsedResults = walkAtRules(css, result, options);
    if (parsedResults.length === 0) {
      return Promise.resolve();
    }
    for (const parsedResult of parsedResults) {
      const {atRule, url, isStringValue, mediaNodes} = parsedResult;
      let normalizedUrl = url;
      const isRequestAble = isUrlRequestAble(normalizedUrl);
      if (isRequestAble) {
        normalizedUrl = normalizeUrl(normalizedUrl, isStringValue);
        if (normalizedUrl.trim().length === 0) {
          result.warn(`Unable to find uri in "${atRule.toString()}"`, {
            node: atRule,
          });
          continue;
        }
      }
      if (isRequestAble) {
        const request = requestify(normalizedUrl, options.rootContext);
        atRule.params = `url(${request})`;
      } else {
        atRule.params = url;
      }
    }
  }
})
export default cssImportParser;