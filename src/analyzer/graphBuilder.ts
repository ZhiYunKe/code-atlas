import path from 'path';
import fs from 'fs';
import { parseDependencies, FileDependencies } from './dependencyParser';

export interface GraphNode {
  id: string; // Relative path from project root
  label: string; // Basename
  type: 'internal' | 'external';
}

export interface GraphEdge {
  source: string; // Node ID
  target: string; // Node ID
}

export interface DependencyGraph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
}

export function buildGraph(targetDir: string, files: string[]): DependencyGraph {
  const graph: DependencyGraph = {
    nodes: new Map(),
    edges: []
  };

  const internalFilesSet = new Set(files);
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.js'];

  // Add all known internal files to nodes first
  for (const file of files) {
    const id = path.relative(targetDir, file).replace(/\\/g, '/');
    graph.nodes.set(id, {
      id,
      label: path.basename(file),
      type: 'internal'
    });
  }

  for (const file of files) {
    const deps = parseDependencies(file);
    const sourceId = path.relative(targetDir, file).replace(/\\/g, '/');

    for (const imp of deps.imports) {
      let targetId = '';
      let isExternal = false;

      // Simple heuristic for internal vs external
      if (imp.startsWith('.')) {
        // Resolve relative path
        const dir = path.dirname(file);
        let resolved = path.resolve(dir, imp);
        
        // Find actual file matching the import
        let found = false;
        if (internalFilesSet.has(resolved)) {
          targetId = path.relative(targetDir, resolved).replace(/\\/g, '/');
          found = true;
        } else {
          // Try appending extensions
          for (const ext of extensions) {
            const withExt = resolved + ext;
            if (internalFilesSet.has(withExt)) {
              targetId = path.relative(targetDir, withExt).replace(/\\/g, '/');
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          // Could be some unresolvable alias or ignored file, treat as external for now
          targetId = imp;
          isExternal = true;
        }
      } else {
        // External package or path alias
        targetId = imp;
        isExternal = true;
      }

      // Add target node if not exists
      if (!graph.nodes.has(targetId)) {
        graph.nodes.set(targetId, {
          id: targetId,
          label: targetId,
          type: isExternal ? 'external' : 'internal'
        });
      }

      // Add edge
      graph.edges.push({
        source: sourceId,
        target: targetId
      });
    }
  }

  return graph;
}
