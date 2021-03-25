const stew = require('broccoli-stew');
const {
  preprocessEmbeddedTemplates,
} = require('babel-plugin-htmlbars-inline-precompile');

module.exports = class TemplateImportPreprocessor {
  constructor(
    templateCompilerPath,
    importIdentifier = 'hbs',
    importPath = 'ember-template-imports',
    templateTag = 'template',
    templateTagReplacement = 'GLIMMER_TEMPLATE'
  ) {
    this.name = 'template-imports-preprocessor';

    this.templateTagConfig = {
      getTemplateLocalsRequirePath: templateCompilerPath,
      getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

      templateTag,
      templateTagReplacement,

      includeSourceMaps: true,
      includeTemplateTokens: true,
    };

    this.templateLiteralConfig = {
      getTemplateLocalsRequirePath: templateCompilerPath,
      getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

      importIdentifier,
      importPath,

      includeSourceMaps: true,
      includeTemplateTokens: true,
    };
  }

  toTree(tree) {
    let compiled = stew.map(
      tree,
      `**/*.{js,gjs,ts,gts}`,
      (string, relativePath) => {
        if (relativePath.match(/\.(gjs|gts)$/)) {
          return preprocessEmbeddedTemplates(
            string,
            Object.assign({ relativePath }, this.templateTagConfig)
          ).output;
        } else {
          return preprocessEmbeddedTemplates(
            string,
            Object.assign({ relativePath }, this.templateLiteralConfig)
          ).output;
        }
      }
    );

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gjs$/, '.js').replace(/\.gts$/, '.ts');
    });
  }
};
