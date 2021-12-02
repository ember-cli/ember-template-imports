const filePath = require('path');
const { registerRefs, TEMPLATE_LITERAL_IDENTIFIER } = require('./util');

module.exports.transformTemplateLiteral = function (t, path, compiled, state) {
  let { parentPath } = path;
  let filename = filePath.parse(state.file.opts.filename).name;

  if (parentPath.node.type === 'ClassProperty') {
    if (parentPath.node.static !== true) {
      throw path.buildCodeFrameError(
        `Attempted to use \`${TEMPLATE_LITERAL_IDENTIFIER}\` with a non-static class field. Templates declared with this helper must be assigned to the \`static template\` class field`
      );
    }

    if (parentPath.node.key.name !== 'template') {
      throw path.buildCodeFrameError(
        `Attempted to use \`${TEMPLATE_LITERAL_IDENTIFIER}\` with the ${parentPath.node.key.name} class property. Templates declared with this helper must be assigned to the \`static template\` class field`
      );
    }

    let classPath = parentPath.parentPath.parentPath;

    if (classPath.node.type === 'ClassDeclaration') {
      if (classPath.node.id === null) {
        registerRefs(
          classPath.replaceWith(
            buildClassExpression(t, state, classPath, compiled)
          ),
          (newPath) => [newPath.parentPath.get('declaration')]
        );
      } else {
        registerRefs(
          classPath.insertAfter(
            t.expressionStatement(
              t.callExpression(
                state.ensureImport('setComponentTemplate', '@ember/component'),
                [compiled, classPath.node.id]
              )
            )
          ),
          (newPath) => [
            newPath.get('expression.callee'),
            newPath.get('expression.arguments.0.callee'),
          ]
        );
      }
    } else {
      registerRefs(
        classPath.replaceWith(
          t.expressionStatement(
            t.callExpression(
              state.ensureImport('setComponentTemplate', '@ember/component'),
              [compiled, classPath.node]
            )
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
    let varId =
      parentPath.node.id || path.scope.generateUidIdentifier(filename);

    registerRefs(
      path.replaceWith(
        t.callExpression(
          state.ensureImport('setComponentTemplate', '@ember/component'),
          [
            compiled,
            t.callExpression(
              state.ensureImport('default', '@ember/component/template-only'),
              [t.stringLiteral(filename), t.stringLiteral(varId.name)]
            ),
          ]
        )
      ),
      (newPath) => [
        newPath.get('callee'),
        newPath.get('arguments.0.callee'),
        newPath.get('arguments.1.callee'),
      ]
    );
  }
};

function buildClassExpression(t, state, classPath, compiled) {
  return t.callExpression(
    state.ensureImport('setComponentTemplate', '@ember/component'),
    [
      compiled,
      t.classExpression(
        classPath.node.id,
        classPath.node.superClass,
        classPath.node.body,
        classPath.node.decorators
      ),
    ]
  );
}
