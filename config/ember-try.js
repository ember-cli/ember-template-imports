'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  const ember5Deps = {
    '@ember/string': '^3.1.1',
    '@ember/test-helpers': '^3.2.0',
    'ember-qunit': '^7.0.0',
    'ember-resolver': '^11.0.0',
    'ember-auto-import': '^2.3.0',
    'ember-cli': '^5.1.0',
    'ember-maybe-import-regenerator': null,
  };

  const release = await getChannelURL('release');

  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-3.27',
        npm: {
          devDependencies: {
            'ember-source': '~3.27.0',
            'ember-cli': '~4.12.1',
            '@ember/test-helpers': '^2.2.0',
            'ember-qunit': '^5.1.2',
          },
        },
      },
      {
        name: 'ember-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.3',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': release,
            ...ember5Deps,
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
            'ember-cli': '^5.0.0',
            ...ember5Deps,
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
            'ember-cli': '^5.0.0',
            ...ember5Deps,
          },
        },
      },
      embroiderSafe({
        name: 'embroider-safe-min-supported',
        npm: {
          devDependencies: {
            'ember-source': '~3.27.0',
          },
        },
      }),
      embroiderOptimized({
        name: 'embroider-optimized-min-supported',
        npm: {
          devDependencies: {
            'ember-source': '~3.27.0',
          },
        },
      }),
      embroiderSafe({
        name: 'embroider-safe-release',
        npm: {
          devDependencies: {
            'ember-source': release,
            ...ember5Deps,
          },
        },
      }),
      embroiderOptimized({
        name: 'embroider-optimized-release',
        npm: {
          devDependencies: {
            'ember-source': release,
            ...ember5Deps,
          },
        },
      }),
    ],
  };
};
