<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="80" alt="CodeAtlas Icon" />
  <h1>CodeAtlas ✨</h1>
  <p><strong>只需几秒钟，自动为你的代码库生成精美的架构图和文档。</strong></p>
  
  <p>
    <a href="https://github.com/ZhiYunKe/code-atlas/stargazers"><img src="https://img.shields.io/github/stars/ZhiYunKe/code-atlas?style=flat-square&color=yellow" alt="Stars" /></a>
    <a href="https://www.npmjs.com/package/code-atlas"><img src="https://img.shields.io/npm/v/code-atlas?style=flat-square&color=blue" alt="NPM Version" /></a>
    <a href="https://github.com/ZhiYunKe/code-atlas/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## 🌟 为什么选择 CodeAtlas?

接手一个新项目，面对一堆文件无从下手？**CodeAtlas** 是一个零配置的 CLI 工具，它能瞬间扫描你的 JavaScript/TypeScript 项目，提取依赖关系，并生成能够直接在 Markdown 中完美渲染的 **Mermaid.js 架构图**。

- 🚀 **零配置**：开箱即用，自动读取并尊重你的 `.gitignore` 配置。
- 💅 **绝美 CLI**：基于 `@clack/prompts` 打造，带来丝滑、现代的终端交互体验。
- 📊 **原生 GitHub 支持**：生成的 Markdown 架构图可直接在 GitHub 上完美呈现。
- ⚡ **快如闪电**：底层由 `ts-morph` 和 `fast-glob` 驱动，毫秒级分析成百上千个文件。

## 📦 快速开始

你甚至不需要安装它！只需在任何 JS/TS 项目的根目录下使用 `npx`：

```bash
npx code-atlas generate
```

*(或者，你也可以选择全局安装)*
```bash
npm i -g code-atlas
code-atlas generate
```

## 🛠️ 工作原理

1. **扫描 (Scan)**：CodeAtlas 会遍历你的工作目录，找到所有的 `.js`, `.ts`, `.jsx`, 和 `.tsx` 文件，同时智能忽略 `.gitignore` 和 `node_modules` 中的路径。
2. **解析 (Parse)**：解析文件的 AST (抽象语法树)，提取所有的 ES Modules `import` 和 CommonJS `require` 调用。
3. **构图 (Graph)**：构建一个完整的包含内部和外部依赖关系的有向图。
4. **输出 (Output)**：自动生成一个包含精美 Mermaid 图表的 `docs/architecture.md` 文件。

## 🎨 示例输出

以下是 CodeAtlas 为其自身源码生成的架构图效果：

```mermaid
graph TD
  tsup_config_ts["📄 tsup.config.ts"]
  class tsup_config_ts internal;
  src_cli_ts["📄 cli.ts"]
  class src_cli_ts internal;
  src_analyzer_dependencyParser_ts["📄 dependencyParser.ts"]
  class src_analyzer_dependencyParser_ts internal;
  src_analyzer_graphBuilder_ts["📄 graphBuilder.ts"]
  class src_analyzer_graphBuilder_ts internal;
  src_generator_markdownGen_ts["📄 markdownGen.ts"]
  class src_generator_markdownGen_ts internal;
  src_generator_mermaidGen_ts["📄 mermaidGen.ts"]
  class src_generator_mermaidGen_ts internal;
  src_scanner_fileSystem_ts["📄 fileSystem.ts"]
  class src_scanner_fileSystem_ts internal;
  tsup(["📦 tsup"])
  class tsup external;
  _clack_prompts(["📦 @clack/prompts"])
  class _clack_prompts external;
  commander(["📦 commander"])
  class commander external;
  picocolors(["📦 picocolors"])
  class picocolors external;
  fs(["📦 fs"])
  class fs external;
  path(["📦 path"])
  class path external;
  typescript(["📦 typescript"])
  class typescript external;
  fast_glob(["📦 fast-glob"])
  class fast_glob external;
  ignore(["📦 ignore"])
  class ignore external;

  tsup_config_ts --> tsup
  src_cli_ts --> _clack_prompts
  src_cli_ts --> commander
  src_cli_ts --> picocolors
  src_cli_ts --> src_scanner_fileSystem_ts
  src_cli_ts --> src_analyzer_graphBuilder_ts
  src_cli_ts --> src_generator_mermaidGen_ts
  src_cli_ts --> src_generator_markdownGen_ts
  src_analyzer_dependencyParser_ts --> fs
  src_analyzer_dependencyParser_ts --> path
  src_analyzer_dependencyParser_ts --> typescript
  src_analyzer_graphBuilder_ts --> path
  src_analyzer_graphBuilder_ts --> fs
  src_analyzer_graphBuilder_ts --> src_analyzer_dependencyParser_ts
  src_generator_markdownGen_ts --> fs
  src_generator_markdownGen_ts --> path
  src_generator_mermaidGen_ts --> src_analyzer_graphBuilder_ts
  src_scanner_fileSystem_ts --> fs
  src_scanner_fileSystem_ts --> path
  src_scanner_fileSystem_ts --> fast_glob
  src_scanner_fileSystem_ts --> ignore

  classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;
  classDef internal fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
  classDef external fill:#f1f8e9,stroke:#689f38,stroke-width:1px;
```

## 🤝 参与贡献
我们非常欢迎 PR！如果你有新功能的想法，或者想要修复 Bug，随时可以提交 Issue 或 Pull Request。

## 📄 开源协议
MIT © CodeAtlas
