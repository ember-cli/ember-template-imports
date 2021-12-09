// import { hbs } from 'ember-template-imports';
// const Greeting = hbs`Hello!`;
exports.TEMPLATE_LITERAL_IDENTIFIER = 'hbs';
exports.TEMPLATE_LITERAL_MODULE_SPECIFIER = 'ember-template-imports';
exports.isTemplateLiteral = (callExpressionPath) => {
  let callee = callExpressionPath.get('callee');
  return (
    callee.isIdentifier() &&
    callee.referencesImport(
      exports.TEMPLATE_LITERAL_MODULE_SPECIFIER,
      exports.TEMPLATE_LITERAL_IDENTIFIER
    )
  );
};

// const Greeting = <template>Hello</template>
exports.TEMPLATE_TAG_NAME = 'template';
exports.TEMPLATE_TAG_PLACEHOLDER = '__GLIMMER_TEMPLATE';
exports.isTemplateTag = (callExpressionPath) => {
  let callee = callExpressionPath.get('callee');
  return (
    callee.isIdentifier() &&
    callee.node.name === exports.TEMPLATE_TAG_PLACEHOLDER
  );
};

exports.buildPrecompileTemplateCall = (t, callExpressionPath, state) => {
  return t.callExpression(
    state.importUtil.import(
      callExpressionPath.get('callee'),
      '@ember/template-compilation',
      'precompileTemplate'
    ),
    callExpressionPath.node.arguments
  );
};

exports.registerRefs = (newPath, getRefPaths) => {
  if (Array.isArray(newPath)) {
    if (newPath.length > 1) {
      throw new Error(
        'registerRefs is only meant to handle single node transformations. Received more than one path node.'
      );
    }

    newPath = newPath[0];
  }

  let refPaths = getRefPaths(newPath);

  for (let ref of refPaths) {
    let binding = ref.scope.getBinding(ref.node.name);
    if (binding !== undefined) {
      binding.reference(ref);
    }
  }
};
