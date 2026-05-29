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
  .description('为您自动生成精美的代码库架构图。')
  .version('1.0.0')
  .option('-d, --dir <path>', '需要分析的目录', process.cwd())
  .action(async (options) => {
    console.clear();
    intro(`${pc.bgCyan(pc.black(' CodeAtlas '))} ${pc.cyan('v1.0.0')}`);

    const s = spinner();
    const targetDir = options.dir;

    try {
      // Step 1: Scan
      s.start('正在扫描代码库中的 TS/JS 文件 (已自动遵循 .gitignore 规则)...');
      const files = await getFilesToAnalyze(targetDir);
      s.stop(`扫描完成，共找到 ${pc.green(files.length)} 个待分析文件。`);

      if (files.length === 0) {
        cancel('未找到受支持的文件。程序退出。');
        return process.exit(0);
      }

      // Step 2: Analyze
      s.start('正在分析语法树 (AST) 并提取依赖关系...');
      const graph = buildGraph(targetDir, files);
      s.stop(`关系图构建完毕: 包含 ${pc.blue(graph.nodes.size)} 个节点和 ${pc.magenta(graph.edges.length)} 条连线。`);

      // Step 3: Generate
      s.start('正在生成 Mermaid 架构图及 Markdown 文档...');
      const mermaidStr = generateMermaid(graph);
      generateMarkdown(targetDir, mermaidStr);
      s.stop(`文档已成功生成至 ${pc.green('./docs/architecture.md')}`);

      note(
        `请在编辑器中或 GitHub 上打开 ${pc.cyan('./docs/architecture.md')}\n以查看渲染后的架构图！`,
        '下一步'
      );

      outro(pc.green('完成！让你的代码库焕然一新吧！ ✨'));
    } catch (error: any) {
      s.stop(pc.red('执行过程中发生错误。'));
      cancel(error.message);
      process.exit(1);
    }
  });

program.parse();
