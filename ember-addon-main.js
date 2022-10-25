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

    // Used in ember-cli-htmlbars to get the location of templateCompiler without traversing this.addons (https://github.com/ember-cli/ember-cli-htmlbars/blob/6860beed9a357d5e948abd09754e8a978fed1320/lib/ember-addon-main.js#L264)
    let ember = this.project.findAddonByName('ember-source');

    this.templateCompilerPath = ember.absolutePaths.templateCompiler;
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
