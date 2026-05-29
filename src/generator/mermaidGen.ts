import { DependencyGraph } from '../analyzer/graphBuilder';

export function generateMermaid(graph: DependencyGraph): string {
  let mermaid = 'graph TD\n';

  // Output nodes
  for (const [id, node] of graph.nodes) {
    const safeId = id.replace(/[^a-zA-Z0-9]/g, '_');
    const safeLabel = node.label.replace(/"/g, '\\"');
    
    if (node.type === 'external') {
      mermaid += `  ${safeId}(["📦 ${safeLabel}"])\n`;
      mermaid += `  class ${safeId} external;\n`;
    } else {
      mermaid += `  ${safeId}["📄 ${safeLabel}"]\n`;
      mermaid += `  class ${safeId} internal;\n`;
    }
  }

  mermaid += '\n';

  // Output edges
  for (const edge of graph.edges) {
    const safeSource = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
    const safeTarget = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
    mermaid += `  ${safeSource} --> ${safeTarget}\n`;
  }

  // Styles
  mermaid += '\n';
  mermaid += '  classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px;\n';
  mermaid += '  classDef internal fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;\n';
  mermaid += '  classDef external fill:#f1f8e9,stroke:#689f38,stroke-width:1px;\n';

  return mermaid;
}
