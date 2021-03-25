'use strict';
require('validate-peer-dependencies')(__dirname);
let VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    let emberChecker = new VersionChecker(this.project).for('ember-source');
    let htmlbarsChecker = new VersionChecker(this.parent).for(
      'ember-cli-htmlbars'
    );

    if (!emberChecker.gte('3.25.0')) {
      throw new Error(
        'ember-template-imports requires ember-source 3.25.0 or higher'
      );
    }

    if (!htmlbarsChecker.gte('5.4.0')) {
      throw new Error(
        'ember-template-imports requires ember-cli-htmlbars 5.4.0 or higher as a peer dependency'
      );
    }

    let addonOptions = this._getAddonOptions();

    let emberCliHtmlbarsOptions = (addonOptions['ember-cli-htmlbars'] =
      addonOptions['ember-cli-htmlbars'] || {});

    emberCliHtmlbarsOptions._customInlineModules = {
      'ember-template-imports': {
        export: 'hbs',
        useTemplateLiteralProposalSemantics: 1,
      },

      'TEMPLATE-TAG-MODULE': {
        export: 'GLIMMER_TEMPLATE',
        debugName: '<template>',
        useTemplateTagProposalSemantics: 1,
      },
    };
  },

  _getAddonOptions() {
    return (
      (this.parent && this.parent.options) ||
      (this.app && this.app.options) ||
      {}
    );
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let templateCompilerPath = this.parent.addons
        .find((a) => a.name === 'ember-cli-htmlbars')
        .templateCompilerPath();

      let TemplateImportPreprocessor = require('./lib/preprocessor-plugin');
      registry.add('js', new TemplateImportPreprocessor(templateCompilerPath));
    }
  },
};
