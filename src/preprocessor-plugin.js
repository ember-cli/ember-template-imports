const stew = require('broccoli-stew');
const util = require('./util');
const {
  preprocessEmbeddedTemplates,
} = require('babel-plugin-htmlbars-inline-precompile');

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

    this.templateLiteralConfig = {
      getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

      importIdentifier: util.TEMPLATE_LITERAL_IDENTIFIER,
      importPath: util.TEMPLATE_LITERAL_MODULE_SPECIFIER,

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
