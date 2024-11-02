
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
function cardWrapper(html: any) {
  const group = html
    .replace(/<h3/g, ':::<h3')
    .replace(/<h2/g, ':::<h2')
    .replace(/:::\s*props/g, '')
    .replace(/:::\s*desc/g, '')
    .split(':::');
  return group
    .map((fragment: any) => {
      if (fragment.indexOf('<h3') !== -1) {
        return `<div class="card">${fragment}</div>`;
      }
      return fragment;
    })
    .join('');
};

class MarkdownParser {
  private content: string;
  private options: any;
  private parser: any;
  private data: any;
  constructor(content: string, options = {}) {
    this.content = content;
    this.options = options;
    this.parser = new MarkdownIt({
      html: true,
      highlight: this.highlight,
      ...options
    });
    this.parser.use(markdownItAnchor, {
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
  highlight(str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, str, true).value;
    }
    return '';
  }
  wrapper(content: string) {
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
export default function(source: string) {
  // 获取选项配置
  try {
    const parser = new MarkdownParser(source);
    return parser.getCode();
  } catch (e) {
    console.log(e);
    return null;
  }
};