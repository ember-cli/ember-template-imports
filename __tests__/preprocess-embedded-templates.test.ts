import { preprocessEmbeddedTemplates } from '../src/preprocess-embedded-templates';
import { getTemplateLocals } from '@glimmer/syntax';
import * as util from '../src/util';

describe('preprocessEmbeddedTemplates', function () {
  it('<template></template>', function () {
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

  it('<template></template> with backticks in content', function () {
    const input = '<template>Hello `world`!</template>';
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      includeSourceMaps: false,
      includeTemplateTokens: false,
    });

    const expected = {
      output:
        '[__GLIMMER_TEMPLATE(`Hello \\`world\\`!`, { strictMode: true })]',
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
          index: 24,
          oldLength: 11,
          newLength: 25,
          originalCol: 25,
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

  it('hbs`Hello \\`world\\``', function () {
    const input = `hbs\`Hello \\\`world\\\`!\``; // template tag with escaped backticks in content
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

  it('includes source maps', function () {
    const input = `<template>Hello!</template>`;
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      includeSourceMaps: true,
      includeTemplateTokens: false,
    });

    expect(templates.output).toContain('//# sourceMappingURL');
  });
  it("doesn't include source maps if no templates", function () {
    const input = `const foo = "Hello!"`;
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      includeSourceMaps: true,
      includeTemplateTokens: false,
    });

    expect(templates.output).not.toContain('//# sourceMappingURL');
  });
});
