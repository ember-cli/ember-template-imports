const filePath = require('path');

/**
 * Supports the following syntaxes:
 *
 * const Foo = [GLIMMER_TEMPLATE('hello')];
 *
 * export const Foo = [GLIMMER_TEMPLATE('hello')];
 *
 * export default [GLIMMER_TEMPLATE('hello')];
 *
 * class Foo {
 *   [GLIMMER_TEMPLATE('hello')];
 * }
 */
module.exports.replaceTemplateTagProposal = function (t, path, state, compiled, options) {
  let version = options.useTemplateTagProposalSemantics;

  if (typeof version !== 'number' || version !== 1) {
    throw path.buildCodeFrameError(
      'Passed an invalid version for useTemplateTagProposalSemantics. This option must be assign a version number. The current valid version numbers are: 1'
    );
  }

  path = path.parentPath;
  let filename = filePath.parse(state.file.opts.filename).name;

  if (path.type === 'ArrayExpression') {
    let arrayParentPath = path.parentPath;

    if (arrayParentPath.type === 'VariableDeclarator') {
      let varId = arrayParentPath.node.id;
      let varDeclaration = arrayParentPath.parentPath;

      varDeclaration.insertAfter(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            varId,
          ])
        )
      );
      path.replaceWith(
        t.callExpression(state.ensureImport('templateOnly', '@ember/component/template-only'), [
          t.stringLiteral(filename),
          t.stringLiteral(varId.name),
        ])
      );

      return;
    } else if (arrayParentPath.type === 'ExportDefaultDeclaration') {
      let varId = path.scope.generateUidIdentifier(filename);

      arrayParentPath.insertBefore(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            varId,
            t.callExpression(state.ensureImport('templateOnly', '@ember/component/template-only'), [
              t.stringLiteral(filename),
              t.stringLiteral(varId.name),
            ])
          ),
        ])
      );
      arrayParentPath.insertBefore(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            varId,
          ])
        )
      );
      path.replaceWith(varId);

      return;
    } else if (arrayParentPath.parentPath.type === 'Program') {
      let varId = path.scope.generateUidIdentifier(filename);

      arrayParentPath.insertBefore(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            varId,
            t.callExpression(state.ensureImport('templateOnly', '@ember/component/template-only'), [
              t.stringLiteral(filename),
              t.stringLiteral(varId.name),
            ])
          ),
        ])
      );
      arrayParentPath.insertBefore(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            varId,
          ])
        )
      );
      arrayParentPath.replaceWith(t.exportDefaultDeclaration(varId));

      return;
    }
  }

  if (path.type === 'ClassProperty') {
    let classPath = path.parentPath.parentPath;

    if (classPath.node.type === 'ClassDeclaration') {
      classPath.insertAfter(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            classPath.node.id,
          ])
        )
      );
    } else {
      classPath.replaceWith(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            classPath.node,
          ])
        )
      );
    }

    path.remove();

    return;
  }

  throw path.buildCodeFrameError(
    `Attempted to use \`${
      options.debugName || options.originalName
    }\` to define a template in an unsupported way. Templates defined using this syntax must be:\n\n1. Assigned to a variable declaration OR\n2. The default export of a file OR\n2. In the top level of the file on their own (sugar for \`export default\`) OR\n4. Used directly within a named class body`
  );
};
