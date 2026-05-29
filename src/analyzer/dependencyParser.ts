import fs from 'fs';
import path from 'path';
import ts from 'typescript';

export interface FileDependencies {
  filePath: string;
  imports: string[];
}

export function parseDependencies(filePath: string): FileDependencies {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const imports: string[] = [];

  const visit = (node: ts.Node) => {
    // import { x } from 'y'; or import x from 'y';
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        imports.push(moduleSpecifier.text);
      }
    }
    // export * from 'y';
    else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      if (ts.isStringLiteral(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
    }
    // require('y') or dynamic import('y')
    else if (ts.isCallExpression(node)) {
      const expression = node.expression;
      const isRequire = ts.isIdentifier(expression) && expression.text === 'require';
      const isDynamicImport = expression.kind === ts.SyntaxKind.ImportKeyword;

      if ((isRequire || isDynamicImport) && node.arguments.length > 0) {
        const arg = node.arguments[0];
        if (ts.isStringLiteral(arg)) {
          imports.push(arg.text);
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return {
    filePath,
    imports,
  };
}
