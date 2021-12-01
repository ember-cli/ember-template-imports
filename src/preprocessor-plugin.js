const stew = require('broccoli-stew');
const {
  preprocessEmbeddedTemplates,
} = require('babel-plugin-htmlbars-inline-precompile');

module.exports = class TemplateImportPreprocessor {
  constructor(
    getTemplateCompilerPath,
    importIdentifier = 'hbs',
    importPath = 'ember-template-imports',
    templateTag = 'template',
    templateTagReplacement = 'GLIMMER_TEMPLATE'
  ) {
    this.name = 'template-imports-preprocessor';
    this.getTemplateCompilerPath = getTemplateCompilerPath;

    this.templateTagConfig = {
      getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

      templateTag,
      templateTagReplacement,

      includeSourceMaps: true,
      includeTemplateTokens: true,
    };

    this.templateLiteralConfig = {
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
        let config = {
          relativePath,
          getTemplateLocalsRequirePath: this.getTemplateCompilerPath(),
        };

        if (relativePath.match(/\.(gjs|gts)$/)) {
          Object.assign(config, this.templateTagConfig);
        } else {
          Object.assign(config, this.templateLiteralConfig);
        }

        return preprocessEmbeddedTemplates(string, config).output;
      }
    );

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gjs$/, '.js').replace(/\.gts$/, '.ts');
    });
  }
};
