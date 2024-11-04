"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const highlight_js_1 = __importDefault(require("highlight.js"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const markdown_it_anchor_1 = __importDefault(require("markdown-it-anchor"));
function cardWrapper(html) {
    const group = html
        .replace(/<h3/g, ':::<h3')
        .replace(/<h2/g, ':::<h2')
        .replace(/:::\s*props/g, '')
        .replace(/:::\s*desc/g, '')
        .split(':::');
    return group
        .map((fragment) => {
        if (fragment.indexOf('<h3') !== -1) {
            return `<div class="card">${fragment}</div>`;
        }
        return fragment;
    })
        .join('');
}
;
class MarkdownParser {
    constructor(content, options = {}) {
        this.content = content;
        this.options = options;
        this.parser = new markdown_it_1.default(Object.assign({ html: true, highlight: this.highlight }, options));
        this.parser.use(markdown_it_anchor_1.default, {
            level: 2
        });
        this.parse();
    }
    parse() {
        this.data = this.wrapper(this.parser.render(this.content)).replace(/\n/g, '');
    }
    getCode() {
        return this.data;
    }
    highlight(str, lang) {
        if (lang && highlight_js_1.default.getLanguage(lang)) {
            return highlight_js_1.default.highlight(lang, str, true).value;
        }
        return '';
    }
    wrapper(content) {
        content = cardWrapper(content);
        content = escape(content);
        return `
  <template>
    <section v-html="content" v-once />
  </template>
  
  <script>
  export default {
    created() {
      this.content = unescape(\`${content}\`);
    },
    mounted() {
      const anchors = [].slice.call(this.$el.querySelectorAll('h2, h3, h4, h5'));
  
      anchors.forEach(anchor => {
        anchor.addEventListener('click', this.scrollToAnchor);
      });
    },
  
    methods: {
      scrollToAnchor(event) {
        if (event.target.id) {
          this.$router.push({
            path: this.$route.path,
            hash: event.target.id
          })
        }
      }
    }
  };
  </script>
  `;
    }
}
function default_1(source) {
    // 获取选项配置
    try {
        const parser = new MarkdownParser(source);
        return parser.getCode();
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
;
