import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import ignore from 'ignore';

export async function getFilesToAnalyze(targetDir: string): Promise<string[]> {
  const gitignorePath = path.join(targetDir, '.gitignore');
  const ig = ignore();
  
  // Add default ignores
  ig.add(['node_modules/**', '.git/**', 'dist/**', 'build/**', '**/*.d.ts']);

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    ig.add(gitignoreContent);
  }

  // Get all JS/TS files
  const files = await fg(['**/*.ts', '**/*.js', '**/*.jsx', '**/*.tsx'], {
    cwd: targetDir,
    dot: true,
  });

  // Filter using ignore
  const filteredFiles = ig.filter(files);
  
  return filteredFiles.map(f => path.join(targetDir, f));
}
