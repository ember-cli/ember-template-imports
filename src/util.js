// ember-template-lint@4.14.0 landed a direct import of this file as `import * as util from 'ember-template-imports/src/util.js';`
// in order to prevent users from getting errors when getting a floating version of `ember-template-imports` that includes this file
// being rewritting in `.ts` we need to re-export from `lib/utils.js`.
//
// TODO: this should be removed in the next major version
module.exports = require('../lib/util');
