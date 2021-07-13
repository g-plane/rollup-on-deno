import ts from "https://esm.sh/typescript";

const transformer: ts.TransformerFactory<ts.Bundle | ts.SourceFile> = (
  context,
) => {
  const visitor: ts.Visitor = (node) => {
    if (
      ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const specifier = node.moduleSpecifier.text;
      if (specifier.endsWith(".ts")) {
        return ts.factory.updateImportDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.importClause,
          ts.factory.createStringLiteral(specifier.replace(/\.tsx?$/, "")),
        );
      } else {
        return node;
      }
    }

    if (
      ts.isExportDeclaration(node) && node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const specifier = node.moduleSpecifier.text;
      if (specifier.endsWith(".ts")) {
        return ts.factory.updateExportDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.isTypeOnly,
          node.exportClause,
          ts.factory.createStringLiteral(specifier.replace(/\.tsx?$/, "")),
        );
      } else {
        return node;
      }
    }

    return ts.visitEachChild(node, visitor, context);
  };

  return (node) => ts.visitNode(node, visitor);
};

export const stripTsExtension: ts.CustomTransformers = {
  afterDeclarations: [
    transformer,
  ],
};
