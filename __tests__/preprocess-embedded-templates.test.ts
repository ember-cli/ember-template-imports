import { preprocessEmbeddedTemplates } from '../src/preprocess-embedded-templates';
import { getTemplateLocals } from '@glimmer/syntax';
const util = require('../src/util.js');

describe('preprocessEmbeddedTemplates', function () {
  it('<template><template>', function () {
    const input = `<template>Hello!</template>`;
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      includeSourceMaps: false,
      includeTemplateTokens: false,
    });

    const expected = {
      output: '[__GLIMMER_TEMPLATE(`Hello!`, { strictMode: true })]',
      replacements: [
        {
          type: 'start',
          index: 0,
          oldLength: 10,
          newLength: 21,
          originalCol: 1,
          originalLine: 1,
        },
        {
          type: 'end',
          index: 16,
          oldLength: 11,
          newLength: 25,
          originalCol: 17,
          originalLine: 1,
        },
      ],
    };

    expect(templates).toEqual(expected);
  });

  it('hbs`Hello`', function () {
    const input = `hbs\`Hello!\``;
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      importIdentifier: util.TEMPLATE_LITERAL_IDENTIFIER,
      importPath: util.TEMPLATE_LITERAL_MODULE_SPECIFIER,
      includeSourceMaps: false,
      includeTemplateTokens: false,
    });

    const expected = {
      output: input,
      replacements: [],
    };

    expect(templates).toEqual(expected);
  });

  it('hbs`Hello` with import statement', function () {
    const input =
      `import { hbs } from 'ember-template-imports'\n` +
      'const Greeting = hbs`Hello!`\n';
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      importIdentifier: util.TEMPLATE_LITERAL_IDENTIFIER,
      importPath: util.TEMPLATE_LITERAL_MODULE_SPECIFIER,
      includeSourceMaps: false,
      includeTemplateTokens: false,
    });

    const expected = {
      output:
        "import { hbs } from 'ember-template-imports'\nconst Greeting = hbs(`Hello!`, { strictMode: true })\n",
      replacements: [
        {
          type: 'start',
          index: 62,
          oldLength: 4,
          newLength: 5,
          originalCol: 18,
          originalLine: 2,
        },
        {
          type: 'end',
          index: 72,
          oldLength: 1,
          newLength: 24,
          originalCol: 28,
          originalLine: 2,
        },
      ],
    };

    expect(templates).toEqual(expected);
  });
});
