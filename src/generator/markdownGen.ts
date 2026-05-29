import fs from 'fs';
import path from 'path';

export function generateMarkdown(targetDir: string, mermaidGraph: string, title: string = '代码库架构图'): void {
  const docsDir = path.join(targetDir, 'docs');
  
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const content = `# ${title}

本文档展示了当前代码库的架构和依赖关系图，由 CodeAtlas 自动生成。

## 依赖关系图

\`\`\`mermaid
${mermaidGraph}
\`\`\`

## 图例说明
- 📄 **内部模块**: 项目内部的代码文件。
- 📦 **外部依赖**: NPM 依赖包或其他外部模块。
`;

  const outputPath = path.join(docsDir, 'architecture.md');
  fs.writeFileSync(outputPath, content, 'utf8');
}
