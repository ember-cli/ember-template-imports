'use strict';

const { maybeEmbroider } = require('@embroider/test-setup');
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    babel: {
      sourceMaps: 'inline',
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
      // useBabelConfig: true,
      // ember-cli-babel related options
    },
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return maybeEmbroider(app);
};
