#!/usr/bin/env node
import { intro, outro, spinner, note, isCancel, cancel } from '@clack/prompts';
import { Command } from 'commander';
import pc from 'picocolors';
import { getFilesToAnalyze } from './scanner/fileSystem';
import { buildGraph } from './analyzer/graphBuilder';
import { generateMermaid } from './generator/mermaidGen';
import { generateMarkdown } from './generator/markdownGen';

const program = new Command();

program
  .name('code-atlas')
  .description('Automatically generate beautiful architecture documentation for your codebase.')
  .version('1.0.0')
  .option('-d, --dir <path>', 'Directory to analyze / 需要分析的目录', process.cwd())
  .option('-l, --lang <lang>', 'Language (en/zh) / 语言 (en/zh)', 'en')
  .action(async (options) => {
    console.clear();
    intro(`${pc.bgCyan(pc.black(' CodeAtlas '))} ${pc.cyan('v1.0.0')}`);

    const s = spinner();
    const targetDir = options.dir;
    const isZh = options.lang === 'zh';

    const t = {
      scanStart: isZh ? '正在扫描代码库中的 TS/JS 文件 (已自动遵循 .gitignore 规则)...' : 'Scanning codebase for TS/JS files (respecting .gitignore)...',
      scanDone: (n: number) => isZh ? `扫描完成，共找到 ${pc.green(n)} 个待分析文件。` : `Found ${pc.green(n)} files to analyze.`,
      noFiles: isZh ? '未找到受支持的文件。程序退出。' : 'No supported files found. Exiting.',
      analyzeStart: isZh ? '正在分析语法树 (AST) 并提取依赖关系...' : 'Analyzing AST and extracting dependencies...',
      analyzeDone: (n: number, e: number) => isZh ? `关系图构建完毕: 包含 ${pc.blue(n)} 个节点和 ${pc.magenta(e)} 条连线。` : `Graph built: ${pc.blue(n)} nodes and ${pc.magenta(e)} edges.`,
      genStart: isZh ? '正在生成 Mermaid 架构图及 Markdown 文档...' : 'Generating Mermaid graph and Markdown documentation...',
      genDone: isZh ? `文档已成功生成至 ${pc.green('./docs/architecture.md')}` : `Documentation successfully generated at ${pc.green('./docs/architecture.md')}`,
      nextSteps: isZh ? `请在编辑器中或 GitHub 上打开 ${pc.cyan('./docs/architecture.md')}\n以查看渲染后的架构图！` : `Open ${pc.cyan('./docs/architecture.md')} in your editor\nor on GitHub to view the rendered architecture diagram!`,
      nextStepsTitle: isZh ? '下一步' : 'Next Steps',
      done: isZh ? '完成！让你的代码库焕然一新吧！ ✨' : 'Done! Let your codebase shine! ✨',
      error: isZh ? '执行过程中发生错误。' : 'An error occurred during execution.'
    };

    try {
      // Step 1: Scan
      s.start(t.scanStart);
      const files = await getFilesToAnalyze(targetDir);
      s.stop(t.scanDone(files.length));

      if (files.length === 0) {
        cancel(t.noFiles);
        return process.exit(0);
      }

      // Step 2: Analyze
      s.start(t.analyzeStart);
      const graph = buildGraph(targetDir, files);
      s.stop(t.analyzeDone(graph.nodes.size, graph.edges.length));

      // Step 3: Generate
      s.start(t.genStart);
      const mermaidStr = generateMermaid(graph);
      generateMarkdown(targetDir, mermaidStr, options.lang);
      s.stop(t.genDone);

      note(t.nextSteps, t.nextStepsTitle);

      outro(pc.green(t.done));
    } catch (error: any) {
      s.stop(pc.red(t.error));
      cancel(error.message);
      process.exit(1);
    }
  });

program.parse();
