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

  it('<template></template> with no content', function () {
    const input = '<template></template>';
    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      includeSourceMaps: false,
      includeTemplateTokens: false,
    });

    const expected = {
      output: '[__GLIMMER_TEMPLATE(``, { strictMode: true })]',
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
          index: 10,
          oldLength: 11,
          newLength: 25,
          originalCol: 11,
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

  it('does not parse <template> within template-literals', function () {
    const input = `
      const DEMO = \`<template>Hi there</template>\`;
    `;

    const templates = preprocessEmbeddedTemplates(input, {
      getTemplateLocals,
      relativePath: 'foo.gjs',
      templateTag: util.TEMPLATE_TAG_NAME,
      templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,
      includeSourceMaps: true,
      includeTemplateTokens: false,
    });

    expect(templates.output).not.toContain(util.TEMPLATE_TAG_PLACEHOLDER);
  });
});
