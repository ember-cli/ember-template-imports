'use strict';

const chalk = require('chalk');

/**
 * Flip this after the first print, because otherwise,
 * the deprecation will print for every occurrence of hbs.
 *
 * The printing of these deprecations is per-tree,
 * so it's possible to print multiple times accidentally.
 */
let hasPrintedHbsDeprecation = false;
/**
 * Boolean we flip on first violation.
 * In case filenames are unavailable, we can still print the deprecation.
 */
let violatorFound = false;

let violators = new Set();

function addViolator(filePath) {
  violators.add(filePath);
  violatorFound = true;
}

function deprecate(msg) {
  /**
   * Surrounding newlines are because this output occurs during the
   * "building..." output of ember-cli, and interlacing
   * dynamic output with static output does not look great normally.
   */
  console.warn(
    '\n\n' + chalk.yellow(`DEPRECATION [ember-template-imports]: ${msg}`) + '\n'
  );
}

function maybePrintHbsDeprecation() {
  if (!violatorFound) return;
  if (hasPrintedHbsDeprecation) return;

  deprecate(
    `importing 'hbs' from 'ember-template-imports' is deprecated and will be removed in the next major (v4.0.0). ` +
      `Please migrate to the <template> syntax per the conclusions in https://github.com/emberjs/rfcs/pull/779.` +
      `\n\n` +
      `\tViolators:\n\n\t` +
      [...violators.entries()].join('\n\t')
  );

  hasPrintedHbsDeprecation = true;
}

module.exports = {
  maybePrintHbsDeprecation,
  addViolator,
};
