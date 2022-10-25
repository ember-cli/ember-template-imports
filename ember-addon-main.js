'use strict';
require('validate-peer-dependencies')(__dirname);
let VersionChecker = require('ember-cli-version-checker');
let { addPlugin, hasPlugin } = require('ember-cli-babel-plugin-helpers');

// eslint-disable-next-line node/no-unpublished-require
const emberAddon = require('ember-source');
const templateCompiler = emberAddon.absolutePaths.templateCompiler;

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

    this.templateCompilerPath = templateCompiler;
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
