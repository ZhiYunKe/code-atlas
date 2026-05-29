<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="80" alt="CodeAtlas Icon" />
  <h1>CodeAtlas ✨</h1>
  <p><strong>Automatically generate beautiful architecture documentation for your codebase in seconds.</strong></p>
  
  <p>
    <a href="https://github.com/yourusername/code-atlas/stargazers"><img src="https://img.shields.io/github/stars/yourusername/code-atlas?style=flat-square&color=yellow" alt="Stars" /></a>
    <a href="https://www.npmjs.com/package/code-atlas"><img src="https://img.shields.io/npm/v/code-atlas?style=flat-square&color=blue" alt="NPM Version" /></a>
    <a href="https://github.com/yourusername/code-atlas/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## 🌟 Why CodeAtlas?

Tired of jumping into a new codebase and having no idea how files connect? **CodeAtlas** is a zero-config CLI tool that instantly scans your JavaScript/TypeScript project, extracts dependencies, and generates a stunning **Mermaid.js architecture diagram** natively rendered in Markdown.

- 🚀 **Zero Config**: Just run it. It respects your `.gitignore` out of the box.
- 💅 **Beautiful CLI**: Built with `@clack/prompts` for a buttery-smooth terminal experience.
- 📊 **Native GitHub Support**: Generates Markdown files with Mermaid graphs that GitHub renders natively.
- ⚡ **Lightning Fast**: Powered by `ts-morph` and `fast-glob`, analyzing hundreds of files in milliseconds.

## 📦 Quick Start

You don't even need to install it! Just use `npx` in the root of any JS/TS project:

```bash
npx code-atlas generate
```

*(Alternatively, install it globally)*
```bash
npm i -g code-atlas
code-atlas generate
```

## 🛠️ How it works

1. **Scan**: CodeAtlas traverses your working directory, finding all `.js`, `.ts`, `.jsx`, and `.tsx` files, completely ignoring paths specified in your `.gitignore` and `node_modules`.
2. **Parse**: It parses the AST of your files to find all ES Modules `import` and CommonJS `require` calls.
3. **Graph**: It builds a complete directed graph of internal and external dependencies.
4. **Output**: It generates a `docs/architecture.md` file containing a gorgeous Mermaid graph.

## 🎨 Example Output

Here is what CodeAtlas generates for its own codebase:

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

## 🤝 Contributing
PRs are welcome! Feel free to open an issue to discuss new features or submit a pull request.

## 📄 License
MIT © CodeAtlas
