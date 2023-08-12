'use strict';
require('validate-peer-dependencies')(__dirname);
let VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    let emberChecker = new VersionChecker(this.project).for('ember-source');
    let emberCliHtmlBars = new VersionChecker(this.project).for(
      'ember-cli-htmlbars'
    );

    let errors = [];

    if (!emberChecker.gte('3.27.0')) {
      errors.push('ember-source 3.27.0 or higher');
    }

    if (!emberCliHtmlBars.gte('6.3.0')) {
      errors.push('ember-cli-htmlbars 6.3.0 or higher');
    }

    if (errors.length > 0) {
      throw new Error(
        'ember-template-imports requires' + '\n\t' + errors.join('\n\t')
      );
    }
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let TemplateImportPreprocessor = require('./src/preprocessor-plugin');
      registry.add('js', new TemplateImportPreprocessor());
    }
  },
};
