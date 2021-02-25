const stew = require('broccoli-stew');
const MagicString = require('magic-string');
const matchAll = require('string.prototype.matchall');
const path = require('path');

function compileGjs(string, relativePath) {
  let s = new MagicString(string);

  let stackCount = 0;
  let matches = matchAll(string, /<template>|<template (.*?)>|<\/template>/g);

  for (let match of matches) {
    if (match[0] === '</template>') {
      if (stackCount > 0) stackCount--;

      if (stackCount === 0) {
        s.overwrite(match.index, match.index + match[0].length, '`)];');
      }
    } else {
      if (stackCount === 0) {
        if (match[1]) {
          throw new Error(
            'ember-template-imports currently does not support passing arguments to <template>'
          );
        }

        s.overwrite(
          match.index,
          match.index + match[0].length,
          '[GLIMMER_TEMPLATE(`'
        );
      }

      stackCount++;
    }
  }

  let { dir, name } = path.parse(relativePath);

  let map = s.generateMap({
    file: `${dir}/${name}.js`,
    source: relativePath,
    includeContent: true,
    hires: true,
  });

  return s.toString() + `\n//# sourceMappingURL=${map.toUrl()}`;
}

// let temp = `
//   <template>
//     <template>

//     </template>
//   </template>
// `;

// console.log(compileGjs(temp, 'test'));

module.exports = class GjsCompiler {
  constructor() {
    this.name = 'gjs-compiler';
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.gjs`, (string, relativePath) =>
      compileGjs(string, relativePath)
    );

    return stew.rename(compiled, '.gjs', '.js');
  }
};
