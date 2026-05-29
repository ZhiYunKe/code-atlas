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
  .option('-d, --dir <path>', 'Directory to analyze', process.cwd())
  .action(async (options) => {
    console.clear();
    intro(`${pc.bgCyan(pc.black(' CodeAtlas '))} ${pc.cyan('v1.0.0')}`);

    const s = spinner();
    const targetDir = options.dir;

    try {
      // Step 1: Scan
      s.start('Scanning codebase for TS/JS files (respecting .gitignore)...');
      const files = await getFilesToAnalyze(targetDir);
      s.stop(`Found ${pc.green(files.length)} files to analyze.`);

      if (files.length === 0) {
        cancel('No supported files found. Exiting.');
        return process.exit(0);
      }

      // Step 2: Analyze
      s.start('Analyzing AST and extracting dependencies...');
      const graph = buildGraph(targetDir, files);
      s.stop(`Graph built: ${pc.blue(graph.nodes.size)} nodes and ${pc.magenta(graph.edges.length)} edges.`);

      // Step 3: Generate
      s.start('Generating Mermaid graph and Markdown documentation...');
      const mermaidStr = generateMermaid(graph);
      generateMarkdown(targetDir, mermaidStr);
      s.stop(`Documentation successfully generated at ${pc.green('./docs/architecture.md')}`);

      note(
        `Open ${pc.cyan('./docs/architecture.md')} in your editor\nor on GitHub to view the rendered architecture diagram!`,
        'Next Steps'
      );

      outro(pc.green('Done! Let your codebase shine! ✨'));
    } catch (error: any) {
      s.stop(pc.red('An error occurred during execution.'));
      cancel(error.message);
      process.exit(1);
    }
  });

program.parse();
