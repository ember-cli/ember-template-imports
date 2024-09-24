const { basename, extname } = require('path');

module.exports = function addTOCNames({ types: t }) {
  return {
    name: 'add-template-only-names-for-inspector',
    visitor: {
      CallExpression(path, state) {
        let calleePath = path.get('callee');

        if (!calleePath.isIdentifier()) {
          return;
        }

        if (
          calleePath.referencesImport(
            '@ember/component/template-only',
            'default',
          )
        ) {
          let params = path.node.arguments;
          let assignment = path.parentPath.parentPath.node;
          let filename = state.filename
            .replace(state.opts.root, '')
            .replace(/\\/g, '/')
            .replace(/template.hbs$/, '')
            .replace(/component\.(js|ts)$/, '')
            .replace(/index\.(js|ts)$/, '')
            .replace(/\/$/, '');
          let rootName = basename(filename).slice(
            0,
            -extname(filename).length || undefined, // undefined -> same as slice(0)
          );
          let assignmentName = t.identifier('undefined');
          if (
            assignment.type === 'AssignmentExpression' &&
            assignment.left.type === 'Identifier'
          ) {
            assignmentName = t.stringLiteral(
              rootName + ':' + assignment.left.name,
            );
          }
          if (
            assignment.type === 'VariableDeclarator' &&
            assignment.id.type === 'Identifier'
          ) {
            assignmentName = t.stringLiteral(
              rootName + ':' + assignment.id.name,
            );
          }
          if (assignment.type === 'ExportDefaultDeclaration') {
            assignmentName = t.stringLiteral(rootName);
          }

          params.length = 0;
          params.push(t.identifier('undefined'), assignmentName);
        }
      },
    },
  };
};
