const filePath = require('path');
const { registerRefs } = require('./util');

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

    registerRefs(
      varDeclaration.insertAfter(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            varId,
          ])
        )
      ),
      (newPath) => [newPath.get('expression.callee'), newPath.get('expression.arguments.0.callee')]
    );

    registerRefs(
      path.replaceWith(
        t.callExpression(state.ensureImport('default', '@ember/component/template-only'), [
          t.stringLiteral(filename),
          t.stringLiteral(varId.name),
        ])
      ),
      (newPath) => [newPath.get('callee')]
    );
  } else if (parentPath.node.type === 'ExportDefaultDeclaration') {
    let varId = path.scope.generateUidIdentifier(filename);

    registerRefs(
      parentPath.insertBefore(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            varId,
            t.callExpression(state.ensureImport('default', '@ember/component/template-only'), [
              t.stringLiteral(filename),
              t.stringLiteral(varId.name),
            ])
          ),
        ])
      ),
      (newPath) => [newPath.get('declarations.0.init.callee')]
    );

    registerRefs(
      parentPath.insertBefore(
        t.expressionStatement(
          t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
            compiled,
            varId,
          ])
        )
      ),
      (newPath) => [newPath.get('expression.callee'), newPath.get('expression.arguments.0.callee')]
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

    let classPath = parentPath.parentPath.parentPath;

    if (classPath.node.type === 'ClassDeclaration') {
      registerRefs(
        classPath.insertAfter(
          t.expressionStatement(
            t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
              compiled,
              classPath.node.id,
            ])
          )
        ),
        (newPath) => [
          newPath.get('expression.callee'),
          newPath.get('expression.arguments.0.callee'),
        ]
      );
    } else {
      registerRefs(
        classPath.replaceWith(
          t.expressionStatement(
            t.callExpression(state.ensureImport('setComponentTemplate', '@ember/component'), [
              compiled,
              classPath.node,
            ])
          )
        ),
        (newPath) => [
          newPath.parentPath.get('callee'),
          newPath.parentPath.get('arguments.0.callee'),
        ]
      );
    }

    parentPath.remove();
  } else {
    throw path.buildCodeFrameError(
      `Attempted to use \`${options.originalName}\` to define a template in an unsupported way. Templates defined using this helper must be:\n\n1. Assigned to a variable declaration OR\n2. The default export of a file OR\n3. Assigned to the \`static template\` field of a named class`
    );
  }
};
