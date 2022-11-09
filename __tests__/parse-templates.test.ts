import {
  parseTemplates as _parseTemplates,
  ParseTemplatesOptions,
  DEFAULT_PARSE_TEMPLATES_OPTIONS,
} from '../src/parse-templates';

describe('parseTemplates', function () {
  /*
    This is just to make snapshot testing a bit easier, since the real `parseTemplates`
    returns `RegExpMatchArray` instances as `start`/`end` the snapshots only display a
    small number of the fields that are available.

    This transforms the `start`/`end` properties into simpler objects with the properties that
    most consumers will be using, so that we can test the function easier.
  */
  function parseTemplates(
    source: string,
    relativePath: string,
    options?: ParseTemplatesOptions
  ) {
    const results = _parseTemplates(source, relativePath, options);

    return results.map((result) => {
      const start = { ...result.start };
      const end = { ...result.end };

      return {
        ...result,

        start,
        end,
      };
    });
  }

  it('<template><template>', function () {
    const input = `<template>Hello!</template>`;

    const templates = parseTemplates(input, 'foo.gjs', {
      templateTag: 'template',
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "</template>",
            "1": undefined,
            "groups": undefined,
            "index": 16,
            "input": "<template>Hello!</template>",
          },
          "start": Object {
            "0": "<template>",
            "1": undefined,
            "groups": undefined,
            "index": 0,
            "input": "<template>Hello!</template>",
          },
          "tagName": "template",
          "type": "template-tag",
        },
      ]
    `);
  });

  it('<template></template> preceded by a slash character', function () {
    const input = `
      const divide = () => 4 / 2;
      <template>Hello!</template>
    `;

    const templates = parseTemplates(input, 'foo.gjs', {
      templateTag: 'template',
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "</template>",
            "1": undefined,
            "groups": undefined,
            "index": 57,
            "input": "
            const divide = () => 4 / 2;
            <template>Hello!</template>
          ",
          },
          "start": Object {
            "0": "<template>",
            "1": undefined,
            "groups": undefined,
            "index": 41,
            "input": "
            const divide = () => 4 / 2;
            <template>Hello!</template>
          ",
          },
          "tagName": "template",
          "type": "template-tag",
        },
      ]
    `);
  });

  // This test demonstrates a problem with the current implementation. The characters "<template>"
  // inside of a regex is treated as an opening template tag instead of being ignored. Previous
  // versions of this addon attempted to address this by parsing "/"-delimited regexes, however
  // the addon's regular-expression based tokenizing was unable to properly distinguish a regex
  // from division, and so the test above this one ("<template></template> preceded by a slash
  // character") did not pass and caused quite confusing failures that occurred far more
  // frequently than the issue demonstrated below will occur.
  it.skip('<template></template> with <template> inside of a regexp', function () {
    const input = `
      const myregex = /<template>/;
      <template>Hello!</template>
    `;

    const templates = parseTemplates(input, 'foo.gjs', {
      templateTag: 'template',
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "end": Object {
            "0": "</template>",
            "1": undefined,
            "groups": undefined,
            "index": 9,
            "input": "
            const myregex = /<template>/;
            <template>Hello!</template>
          ",
          },
          "start": Object {
            "0": "<template>",
            "1": undefined,
            "groups": undefined,
            "index": 43,
            "input": "
            const myregex = /<template>/;
            <template>Hello!</template>
          ",
          },
          "type": "template-tag",
        },
      ]
    `);
  });

  it('hbs`Hello!` when only matching <template>', function () {
    const input = 'hbs`Hello!`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
    });

    expect(templates).toMatchInlineSnapshot(`Array []`);
  });

  it('hbs`Hello!` with imports ember-cli-htmlbars', function () {
    const input = "import { hbs } from 'ember-cli-htmlbars'; hbs`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-cli-htmlbars',
          importIdentifier: 'hbs',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 52,
            "input": "import { hbs } from 'ember-cli-htmlbars'; hbs\`Hello!\`",
          },
          "importIdentifier": "hbs",
          "importPath": "ember-cli-htmlbars",
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 42,
            "input": "import { hbs } from 'ember-cli-htmlbars'; hbs\`Hello!\`",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with imports @ember/template-compilation', function () {
    const input =
      "import { hbs } from '@ember/template-compilation'; hbs`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: '@ember/template-compilation',
          importIdentifier: 'precompileTemplate',
        },
        {
          importPath: '@ember/template-compilation',
          importIdentifier: 'hbs',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 61,
            "input": "import { hbs } from '@ember/template-compilation'; hbs\`Hello!\`",
          },
          "importIdentifier": "hbs",
          "importPath": "@ember/template-compilation",
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 51,
            "input": "import { hbs } from '@ember/template-compilation'; hbs\`Hello!\`",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with imports ember-template-imports', function () {
    const input = "import { hbs } from 'ember-template-imports'; hbs`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-template-imports',
          importIdentifier: 'hbs',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 56,
            "input": "import { hbs } from 'ember-template-imports'; hbs\`Hello!\`",
          },
          "importIdentifier": "hbs",
          "importPath": "ember-template-imports",
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 46,
            "input": "import { hbs } from 'ember-template-imports'; hbs\`Hello!\`",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('renamed hbs`Hello!` with (default) import ember-cli-htmlbars-inline-precompile', function () {
    const input =
      "import theHbs from 'ember-cli-htmlbars-inline-precompile'; theHbs`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-cli-htmlbars-inline-precompile',
          importIdentifier: 'default',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 72,
            "input": "import theHbs from 'ember-cli-htmlbars-inline-precompile'; theHbs\`Hello!\`",
          },
          "importIdentifier": "default",
          "importPath": "ember-cli-htmlbars-inline-precompile",
          "start": Object {
            "0": "theHbs\`",
            "1": "theHbs",
            "groups": undefined,
            "index": 59,
            "input": "import theHbs from 'ember-cli-htmlbars-inline-precompile'; theHbs\`Hello!\`",
          },
          "tagName": "theHbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with (default) import htmlbars-inline-precompile', function () {
    const input = "import hbs from 'htmlbars-inline-precompile'; hbs`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'htmlbars-inline-precompile',
          importIdentifier: 'default',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 56,
            "input": "import hbs from 'htmlbars-inline-precompile'; hbs\`Hello!\`",
          },
          "importIdentifier": "default",
          "importPath": "htmlbars-inline-precompile",
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 46,
            "input": "import hbs from 'htmlbars-inline-precompile'; hbs\`Hello!\`",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('precompileTemplate`Hello!` with import @ember/template-compilation', function () {
    const input =
      "import { precompileTemplate } from '@ember/template-compilation'; precompileTemplate`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: '@ember/template-compilation',
          importIdentifier: 'hbs',
        },
        {
          importPath: '@ember/template-compilation',
          importIdentifier: 'precompileTemplate',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Hello!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 91,
            "input": "import { precompileTemplate } from '@ember/template-compilation'; precompileTemplate\`Hello!\`",
          },
          "importIdentifier": "precompileTemplate",
          "importPath": "@ember/template-compilation",
          "start": Object {
            "0": "precompileTemplate\`",
            "1": "precompileTemplate",
            "groups": undefined,
            "index": 66,
            "input": "import { precompileTemplate } from '@ember/template-compilation'; precompileTemplate\`Hello!\`",
          },
          "tagName": "precompileTemplate",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with imports alias', function () {
    const input =
      "import { hbs as someHbs } from 'ember-cli-htmlbars';\n" +
      "import theHbs from 'htmlbars-inline-precompile';\n" +
      "import { hbs } from 'not-the-hbs-you-want';\n" +
      'hbs`Hello!`\n' +
      'someHbs`Howdy!`\n' +
      'theHbs`Hi!`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-cli-htmlbars',
          importIdentifier: 'hbs',
        },
        {
          importPath: 'htmlbars-inline-precompile',
          importIdentifier: 'default',
        },
      ],
    });

    const expected = [
      {
        contents: 'Howdy!',
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 172,
          input,
        },
        importIdentifier: 'hbs',
        importPath: 'ember-cli-htmlbars',
        start: {
          0: 'someHbs`',
          1: 'someHbs',
          groups: undefined,
          index: 158,
          input,
        },
        tagName: 'someHbs',
        type: 'template-literal',
      },
      {
        contents: 'Hi!',
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 184,
          input,
        },
        importIdentifier: 'default',
        importPath: 'htmlbars-inline-precompile',
        start: {
          0: 'theHbs`',
          1: 'theHbs',
          groups: undefined,
          index: 174,
          input,
        },
        tagName: 'theHbs',
        type: 'template-literal',
      },
    ];

    expect(templates).toEqual(expected);
  });

  it('with multiple identifiers for the same import path', function () {
    const input =
      "import someDefaultHbs, { hbs as someHbs } from 'ember-cli-htmlbars';\n" +
      "import theHbs from 'htmlbars-inline-precompile';\n" +
      "import { hbs } from 'not-the-hbs-you-want';\n" +
      'hbs`Hello!`\n' +
      'someDefaultHbs`Hello!`\n' +
      'someHbs`Howdy!`\n' +
      'theHbs`Hi!`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-cli-htmlbars',
          importIdentifier: 'hbs',
        },
        {
          importPath: 'ember-cli-htmlbars',
          importIdentifier: 'default',
        },
        {
          importPath: 'htmlbars-inline-precompile',
          importIdentifier: 'default',
        },
      ],
    });

    const expected = [
      {
        contents: 'Hello!',
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 195,
          input,
        },
        importIdentifier: 'default',
        importPath: 'ember-cli-htmlbars',
        start: {
          0: 'someDefaultHbs`',
          1: 'someDefaultHbs',
          groups: undefined,
          index: 174,
          input,
        },
        tagName: 'someDefaultHbs',
        type: 'template-literal',
      },
      {
        contents: 'Howdy!',
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 211,
          input,
        },
        importIdentifier: 'hbs',
        importPath: 'ember-cli-htmlbars',
        start: {
          0: 'someHbs`',
          1: 'someHbs',
          groups: undefined,
          index: 197,
          input,
        },
        tagName: 'someHbs',
        type: 'template-literal',
      },
      {
        contents: 'Hi!',
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 223,
          input,
        },
        importIdentifier: 'default',
        importPath: 'htmlbars-inline-precompile',
        start: {
          0: 'theHbs`',
          1: 'theHbs',
          groups: undefined,
          index: 213,
          input,
        },
        tagName: 'theHbs',
        type: 'template-literal',
      },
    ];

    expect(templates).toEqual(expected);
  });

  it('with multiple identifiers for the same import path with DEFAULT_PARSE_TEMPLATES_OPTIONS', function () {
    const input =
      "import someDefaultHbs, { hbs as someHbs } from 'ember-cli-htmlbars';\n" +
      "import theHbs from 'htmlbars-inline-precompile';\n" +
      "import { hbs } from 'not-the-hbs-you-want';\n" +
      'hbs`Hello!`\n' +
      'someDefaultHbs`Hello!`\n' +
      'someHbs`Howdy!`\n' +
      'theHbs`Hi!`';

    const templates = parseTemplates(
      input,
      'foo.js',
      DEFAULT_PARSE_TEMPLATES_OPTIONS
    );

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "contents": "Howdy!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 211,
            "input": "import someDefaultHbs, { hbs as someHbs } from 'ember-cli-htmlbars';
      import theHbs from 'htmlbars-inline-precompile';
      import { hbs } from 'not-the-hbs-you-want';
      hbs\`Hello!\`
      someDefaultHbs\`Hello!\`
      someHbs\`Howdy!\`
      theHbs\`Hi!\`",
          },
          "importIdentifier": "hbs",
          "importPath": "ember-cli-htmlbars",
          "start": Object {
            "0": "someHbs\`",
            "1": "someHbs",
            "groups": undefined,
            "index": 197,
            "input": "import someDefaultHbs, { hbs as someHbs } from 'ember-cli-htmlbars';
      import theHbs from 'htmlbars-inline-precompile';
      import { hbs } from 'not-the-hbs-you-want';
      hbs\`Hello!\`
      someDefaultHbs\`Hello!\`
      someHbs\`Howdy!\`
      theHbs\`Hi!\`",
          },
          "tagName": "someHbs",
          "type": "template-literal",
        },
        Object {
          "contents": "Hi!",
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 223,
            "input": "import someDefaultHbs, { hbs as someHbs } from 'ember-cli-htmlbars';
      import theHbs from 'htmlbars-inline-precompile';
      import { hbs } from 'not-the-hbs-you-want';
      hbs\`Hello!\`
      someDefaultHbs\`Hello!\`
      someHbs\`Howdy!\`
      theHbs\`Hi!\`",
          },
          "importIdentifier": "default",
          "importPath": "htmlbars-inline-precompile",
          "start": Object {
            "0": "theHbs\`",
            "1": "theHbs",
            "groups": undefined,
            "index": 213,
            "input": "import someDefaultHbs, { hbs as someHbs } from 'ember-cli-htmlbars';
      import theHbs from 'htmlbars-inline-precompile';
      import { hbs } from 'not-the-hbs-you-want';
      hbs\`Hello!\`
      someDefaultHbs\`Hello!\`
      someHbs\`Howdy!\`
      theHbs\`Hi!\`",
          },
          "tagName": "theHbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with multiple imports and alias', function () {
    const input =
      "import { hbs as someHbs } from 'ember-cli-htmlbars';\n" +
      "import { hbs } from 'not-the-hbs-you-want';\n" +
      'hbs`Hello!`\n' +
      'someHbs`Howdy!`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-cli-htmlbars',
          importIdentifier: 'hbs',
        },
      ],
    });

    const expected = [
      {
        contents: 'Howdy!',
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 123,
          input,
        },
        importIdentifier: 'hbs',
        importPath: 'ember-cli-htmlbars',
        start: {
          0: 'someHbs`',
          1: 'someHbs',
          groups: undefined,
          index: 109,
          input,
        },
        tagName: 'someHbs',
        type: 'template-literal',
      },
    ];

    expect(templates).toEqual(expected);
  });

  it('lol`hahahaha` with options', function () {
    const input = 'lol`hahaha`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: 'ember-cli-htmlbars',
          importIdentifier: 'hbs',
        },
      ],
    });

    expect(templates).toEqual([]);
  });
});
