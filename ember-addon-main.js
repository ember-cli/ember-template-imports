'use strict';

let VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: require('./package').name,

  _getBabelOptions() {
    const parentOptions = this.parent && this.parent.options;
    const appOptions = this.app && this.app.options;
    const addonOptions = parentOptions || appOptions || {};

    addonOptions.babel = addonOptions.babel || {};
    addonOptions.babel.plugins = addonOptions.babel.plugins || [];
    return addonOptions.babel;
  },

  addBabelPlugin() {
    this._getBabelOptions().plugins.push([
      require.resolve('./src/babel-plugin.js'),
      { v: 1, root: this.parent.root || this.project.root },
    ]);
  },

  included() {
    this._super.included.apply(this, arguments);

    let emberChecker = new VersionChecker(this.project).for('ember-source');
    let emberCliHtmlBars = new VersionChecker(this.parent).for(
      'ember-cli-htmlbars',
    );
    let emberCliBabel = new VersionChecker(this.parent).for('ember-cli-babel');

    let errors = [];

    if (!emberChecker.gte('3.27.0')) {
      errors.push('ember-source 3.27.0 or higher');
    }

    if (!emberCliHtmlBars.gte('6.3.0')) {
      errors.push('ember-cli-htmlbars 6.3.0 or higher');
    }

    if (!emberCliBabel.gte('8.2.0')) {
      errors.push('ember-cli-babel 8.2.0 or higher');
    }

    if (errors.length > 0) {
      throw new Error(
        'ember-template-imports requires' + '\n\t' + errors.join('\n\t'),
      );
    }

    this.addBabelPlugin();
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let TemplateImportPreprocessor = require('./src/preprocessor-plugin');
      registry.add(
        'js',
        new TemplateImportPreprocessor(this._getAddonOptions()),
      );
    }
  },

  _getAddonOptions() {
    let parentOptions = this.parent && this.parent.options;
    let appOptions = this.app && this.app.options;

    const options = parentOptions || appOptions || {};

    return options['ember-template-imports'] || { inline_source_map: false };
  },
};
