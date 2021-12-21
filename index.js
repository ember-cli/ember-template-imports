'use strict';
require('validate-peer-dependencies')(__dirname);
let VersionChecker = require('ember-cli-version-checker');
let { addPlugin, hasPlugin } = require('ember-cli-babel-plugin-helpers');

module.exports = {
  name: require('./package').name,

  included(includer) {
    this._super.included.apply(this, arguments);

    let emberChecker = new VersionChecker(this.project).for('ember-source');

    if (!emberChecker.gte('3.27.0')) {
      throw new Error(
        'ember-template-imports requires ember-source 3.27.0 or higher'
      );
    }

    let pluginPath = require.resolve('./src/babel-plugin');

    if (!hasPlugin(includer, pluginPath)) {
      addPlugin(includer, pluginPath);
    }

    this.templateCompilerPath = this.parent.addons
      .find((a) => a.name === 'ember-cli-htmlbars')
      .templateCompilerPath();
  },

  setupPreprocessorRegistry(type, registry) {
    if (type === 'parent') {
      let TemplateImportPreprocessor = require('./src/preprocessor-plugin');
      registry.add(
        'js',
        new TemplateImportPreprocessor(() => this.templateCompilerPath)
      );
    }
  },
};
