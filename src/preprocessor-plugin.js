const stew = require('broccoli-stew');
const util = require('../lib/util');
const {
  preprocessEmbeddedTemplates,
} = require('../lib/preprocess-embedded-templates');

/**
 * This preprocessor operates on source files as raw strings, converting
 * tagged template strings and embedded `<template>` tags like these:
 *
 * ```js
 * const ComponentB = <template>
 *   <Greeting />, World!
 * </template>;
 *
 * class ComponentC {
 *   <template>
 *     <Greeting />, World!
 *   </template>
 * }
 * ```
 *
 * Into an intermediate representation like this that can be further
 * processed in our Babel plugin.
 *
 * ```js
 * const ComponentB = [__GLIMMER_TEMPLATE(`
 *   <Greeting />, World!
 * `, { strictMode: true, scope: () => ({ Greeting }) })];
 *
 * class ComponentC {
 *   [__GLIMMER_TEMPLATE(`
 *     <Greeting />, World!
 *   `, { strictMode: true, scope: () => ({ Greeting }) })]
 * }
 * ```
 */
module.exports = class TemplateImportPreprocessor {
  constructor(getTemplateCompilerPath) {
    this.name = 'template-imports-preprocessor';
    this.getTemplateCompilerPath = getTemplateCompilerPath;

    this.templateTagConfig = {
      getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,

      includeSourceMaps: true,
      includeTemplateTokens: true,
    };
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.{gjs,gts}`, (string, relativePath) => {
      let config = {
        relativePath,
        getTemplateLocalsRequirePath: this.getTemplateCompilerPath(),
      };

      if (relativePath.match(/\.(gjs|gts)$/)) {
        Object.assign(config, this.templateTagConfig);
      }

      return preprocessEmbeddedTemplates(string, config).output;
    });

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gjs$/, '.js').replace(/\.gts$/, '.ts');
    });
  }
};
