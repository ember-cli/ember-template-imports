const filePath = require('path');

module.exports.replaceTemplateLiteralProposal = function (t, path, state, compiled, options) {
  let version = options.useTemplateLiteralProposalSemantics;

  if (typeof version !== 'number' || version !== 1) {
    throw path.buildCodeFrameError(
      'Passed an invalid version for useTemplateLiteralProposalSemantics. This option must be assign a version number. The current valid version numbers are: 1'
    );
  }

  let { parentPath } = path;
  let filename = filePath.parse(state.file.opts.filename).name;

  if (parentPath.type === 'VariableDeclarator') {
    let varId = parentPath.node.id;
    let varDeclaration = parentPath.parentPath;

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
  } else if (parentPath.node.type === 'ExportDefaultDeclaration') {
    let varId = path.scope.generateUidIdentifier(filename);

    parentPath.insertBefore(
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
    parentPath.insertBefore(
      t.expressionStatement(
        t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
          compiled,
          varId,
        ])
      )
    );
    path.replaceWith(varId);
  } else if (parentPath.node.type === 'ClassProperty') {
    if (parentPath.node.static !== true) {
      throw path.buildCodeFrameError(
        `Attempted to use \`${options.originalName}\` with a non-static class field. Templates declared with this helper must be assigned to the \`static template\` class field`
      );
    }

    if (parentPath.node.key.name !== 'template') {
      throw path.buildCodeFrameError(
        `Attempted to use \`${options.originalName}\` with the ${parentPath.node.key.name} class property. Templates declared with this helper must be assigned to the \`static template\` class field`
      );
    }

    let classDeclaration = parentPath.parentPath.parentPath;

    if (classDeclaration.node.type !== 'ClassDeclaration') {
      throw path.buildCodeFrameError(
        `Attempted to use \`${options.originalName}\` to define a template for an anonymous class. Templates declared with this helper must be assigned to classes which have a name.`
      );
    }

    classDeclaration.insertAfter(
      t.expressionStatement(
        t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
          compiled,
          classDeclaration.node.id,
        ])
      )
    );

    parentPath.remove();
  } else {
    throw path.buildCodeFrameError(
      `Attempted to use \`${options.originalName}\` to define a template in an unsupported way. Templates defined using this helper must be:\n\n1. Assigned to a variable declaration OR\n2. The default export of a file OR\n3. Assigned to the \`static template\` field of a named class`
    );
  }
};
