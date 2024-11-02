## commander
编写代码来描述你的命令行界面。 Commander 负责将参数解析为选项和命令参数。

## chalk
chalk包是一个简单而强大的工具，用于为Node.js环境中的控制台输出添加样式。它提供了丰富的颜色和格式选项，并支持链式调用方式，使得代码更加简洁和易读。

## Portfinder
Portfinder的主要功能是自动查找并分配一个可用的网络端口

## address
address是一个npm包，它主要用于获取当前机器的IPv4、IPv6、MAC地址以及DNS服务器信息

## webpack-dev-server
是webpack官方提供的一个小型Express服务器，专为开发环境设计

- 实时更新：webpack-dev-server能够监听源代码的变化，并实时重新编译和打包，同时自动刷新浏览器，以反映最新的更改。这一特性极大地提高了开发效率，使开发者能够即时看到代码修改的效果。
- 热模块替换（HMR）：webpack-dev-server还支持热模块替换功能。这意味着在应用程序运行时，可以更新模块而无需刷新整个页面。这有助于保持应用程序的状态不变，同时更新特定的模块。
- 内存存储：与webpack直接将打包后的文件输出到磁盘上不同，webpack-dev-server将文件保存在内存中。这使得文件访问速度更快，并且避免了频繁的磁盘读写操作。
- 配置灵活：webpack-dev-server提供了丰富的配置项，如设置静态资源的路径（contentBase）、启用热更新（hot）、自动打开浏览器（open）、配置代理（proxy）等。这些配置项可以根据项目的具体需求进行自定义。
## webpack-merge
将多个Webpack配置文件合并为一个，从而简化配置管理和维护

## fs-extra
Node.js生态中广受欢迎的文件系统扩展库，它扩展并增强了原生的fs（文件系统）模块，提供了更多高级功能，简化了文件和目录操作。

## fork-ts-checker-webpack-plugin
它能够在单独的进程中运行TypeScript类型检查器，从而加速构建过程。

- 加速构建：通过将类型检查任务从主构建进程中分离出来，该插件有效地减少了构建时间，提升了开发效率。它充分利用多核CPU，使得类型检查与代码编译可以并行执行。
- 支持现代TypeScript特性：如项目引用和增量模式，进一步优化了构建性能。增量模式允许只检查自上次构建以来已更改的文件，从而减少了不必要的检查时间。
- 友好的错误提示：使用代码帧格式化器显示错误信息，提供了直观且易于理解的错误提示，有助于开发者快速定位并解决问题。
- 灵活的配置：提供了丰富的配置选项，允许开发者根据项目需求进行灵活调整。例如，可以配置插件以在类型检查期间记录消息，或过滤掉某些级别的警告。

## mini-css-extract-plugin
它用于将CSS从JavaScript包中分离出来，生成独立的CSS文件。
- CSS提取：该插件能够将CSS从JavaScript包中分离出来，并生成独立的CSS文件。这有助于减少JavaScript包的大小，提高页面的加载性能。
- 按需加载：支持CSS和SourceMaps的按需加载，使得只有在需要时才加载相应的CSS文件，进一步优化了页面的加载速度。
- 生产环境优化：适用于生产环境的构建，通过启用CSS压缩等优化手段，可以进一步减小CSS文件的大小，提高页面的加载效率。
- 与Webpack无缝集成：作为Webpack的插件，它与Webpack生态系统中的其他工具（如css-loader、css-minimizer-webpack-plugin等）无缝集成，共同构成了一个强大的前端构建生态系统。
## copy-webpack-plugin

它的主要功能是在Webpack构建过程中复制文件和目录。

## static/js/[name].[chunkhash:8].js

- static/js/：这是输出文件的目录路径。在这个例子中，所有的JavaScript文件都会被放置在static/js/目录下。这个路径是相对于Webpack输出目录（output.path）的。
- [name]：这是一个占位符，代表原始文件或模块的名称。在Webpack中，每个入口（entry）或动态导入（import()）的模块都会有一个名称。对于入口文件，这个名称通常与entry配置中的键相对应。对于动态导入的模块，Webpack会自动生成一个名称。
- [chunkhash:8]：这是一个占位符，用于生成基于内容散列（hash）的文件名。chunkhash是基于每个输出文件的内容生成的散列值，这意味着如果文件内容发生变化，散列值也会变化。:8表示只取散列值的前8个字符作为文件名的一部分。这样做既保证了文件名的唯一性，又缩短了文件名长度，便于管理和缓存。
- .js：这是文件的扩展名，表示这是一个JavaScript文件。

## highlight.js
是一个轻量级、易于使用且支持语法高亮的JavaScript库

- 轻量级：Highlight.js的体积较小，不会给网页带来过多的负担。
- 易于使用：Highlight.js的安装和使用都非常简单，可以通过CDN或者直接下载源代码来引用。
- 支持语法高亮：Highlight.js支持多种编程语言的语法高亮，使得代码在网页上更加易于阅读和理解。
- 内置大量样式和主题：Highlight.js内置了大量的代码样式和主题，用户可以根据自己的需求进行选择和自定义。
## markdown-it
是一个轻量级但功能强大的Markdown解析库，它使用JavaScript编写，适用于Web开发环境。

- 高效性：Markdown-it旨在提供最快的解析速度之一，这对于处理大量Markdown内容尤其重要。
- 高度可配置：Markdown-it提供了丰富的配置选项，允许用户根据需求禁用某些默认功能，或者添加自定义插件以实现特定的解析效果。
- 丰富的插件生态：Markdown-it支持多种插件，这些插件可以扩展Markdown的语法或修改渲染行为，极大地增强了Markdown-it的灵活性和功能性。
- 遵循规范：Markdown-it遵循CommonMark和GitHub flavored Markdown（GFM）规范，确保了跨平台的一致性

### markdown-it-anchor
其主要功能是为Markdown文档中的标题自动生成永久性的锚点链接。这使得在长文档内部快速导航成为可能，同时也便于外部引用特定段落。

- 自动生成锚点：Markdown-it-Anchor可以自动为Markdown文档中的每个标题添加一个唯一的ID属性，并生成对应的锚点链接。这些链接通常显示在标题旁边，用户点击后可以快速跳转到文档中的指定位置。
- 自定义样式：用户可以通过配置选项来自定义锚点链接的样式，包括链接的class、符号等。这有助于保持网站风格的统一，并提升用户体验。
- 支持多种语言：Markdown-it-Anchor支持多种语言的标题ID生成，使得它可以在国际化的项目中得到广泛应用。
- 易于集成：Markdown-it-Anchor作为Markdown-it的插件，易于集成到现有的Markdown解析流程中。用户只需在JavaScript文件中引入并配置该插件，即可实现标题锚点的自动生成。