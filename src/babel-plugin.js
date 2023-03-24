const chalk = require('chalk');
const { ImportUtil } = require('babel-import-util');
const util = require('../lib/util');
const { transformTemplateLiteral } = require('./template-literal-transform');
const { transformTemplateTag } = require('./template-tag-transform');

/**
 * This Babel plugin takes parseable code emitted by the string-based
 * preprocessor plugin in this package and converts it into calls to
 * the standardized `precompileTemplate` macro from `@ember/template-compilation`.
 *
 * Its goal is to convert code like this:
 *
 * ```js
 * import { hbs } from 'ember-template-imports';
 *
 * const A = hbs(`A`, {...});
 * const B = [__GLIMMER_TEMPLATE(`B`, {...})];
 * class C {
 *   template = hbs(`C`, {...});
 * }
 *
 * [__GLIMMER_TEMPLATE(`default`, {...})];
 *
 * class D {
 *   [__GLIMMER_TEMPLATE(`D`, {...})]
 * }
 * ```
 *
 * Into this:
 *
 * ```js
 * import { precompileTemplate } from '@ember/template-compilation';
 * import { setComponentTemplate } from '@ember/component';
 * import templateOnlyComponent from '@ember/component/template-only';
 *
 * const A = setComponentTemplate(
 *   precompileTemplate(`A`, {...}),
 *   templateOnlyComponent('this-module.js', 'A')
 * );
 * const B = setComponentTemplate(
 *   precompileTemplate(`B`, {...}),
 *   templateOnlyComponent('this-module.js', 'B')
 * );
 * class C {}
 * setComponentTemplate(precompileTemplate(`C`, {...}), C);
 *
 * export default setComponentTemplate(
 *   precompileTemplate(`default`, {...}),
 *   templateOnlyComponent('this-module.js', '_thisModule')
 * );
 *
 * class D {}
 * setComponentTemplate(precompileTemplate(`D`, {...}), D);
 * ```
 */
module.exports = function (babel) {
  let t = babel.types;
  let visitor = {
    Program: {
      enter(path, state) {
        state.importUtil = new ImportUtil(t, path);
      },
      exit(path, state) {
        if (state.hadTaggedTemplate) {
          state.importUtil.removeImport(
            util.TEMPLATE_LITERAL_MODULE_SPECIFIER,
            util.TEMPLATE_LITERAL_IDENTIFIER
          );
        }
      },
    },

    // Process class bodies before things like class properties get transformed
    // into imperative constructor code that we can't recognize. Taken directly
    // from babel-plugin-htmlbars-inline-precompile https://git.io/JMi1G
    Class(path, state) {
      path.get('body.body').forEach((path) => {
        if (path.type !== 'ClassProperty') return;

        let keyPath = path.get('key');
        let valuePath = path.get('value');

        if (keyPath && visitor[keyPath.type]) {
          visitor[keyPath.type](keyPath, state);
        }

        if (valuePath && visitor[valuePath.type]) {
          visitor[valuePath.type](valuePath, state);
        }
      });
    },

    CallExpression(path, state) {
      if (util.isTemplateLiteral(path)) {
        maybePrintHbsDeprecation();
        state.hadTaggedTemplate = true;
        transformTemplateLiteral(t, path, state);
      } else if (util.isTemplateTag(path)) {
        transformTemplateTag(t, path, state);
      }
    },
  };

  return { visitor };
};

/**
 * Flip this after the first print, because otherwise,
 * the deprecation will print for every occurrence of hbs.
 *
 * Ideally, if we could aggregate all the file paths that use hbs
 * and then print the warning at the end, we'd have a nicer to-do list for folks to migrate.
 */
let hasPrintedHbsDeprecation = false;

function deprecate(msg) {
  /**
   * Surrounding newlines are because this output occurs during the
   * "building..." output of ember-cli, and interlacing
   * dynamic output with static output does not look great normally.
   */
  console.warn(
    '\n' + chalk.yellow(`DEPRECATION [ember-template-imports]: ${msg}`) + '\n'
  );
}

function maybePrintHbsDeprecation() {
  if (hasPrintedHbsDeprecation) return;

  deprecate(
    `importing 'hbs' from 'ember-template-imports' is deprecated and will be removed in the next major (v4.0.0). ` +
      `Please migrate to the <template> syntax per the conclusions in https://github.com/emberjs/rfcs/pull/779.`
  );

  hasPrintedHbsDeprecation = true;
}
