// import { hbs } from 'ember-template-imports';
module.exports.TEMPLATE_LITERAL_IDENTIFIER = 'hbs';
module.exports.TEMPLATE_LITERAL_MODULE_SPECIFIER = 'ember-template-imports';

// <template>Hello</template>
module.exports.TEMPLATE_TAG_NAME = 'template';
module.exports.TEMPLATE_TAG_PLACEHOLDER = '__GLIMMER_TEMPLATE';

module.exports.registerRefs = (newPath, getRefPaths) => {
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
