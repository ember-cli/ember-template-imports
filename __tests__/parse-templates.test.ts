import {
  parseTemplates as _parseTemplates,
  ParseTemplatesOptions,
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
          "type": "template-tag",
        },
      ]
    `);
  });

  it('hbs`Hello!`', function () {
    const input = 'hbs`Hello!`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 10,
            "input": "hbs\`Hello!\`",
          },
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 0,
            "input": "hbs\`Hello!\`",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
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
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 52,
            "input": "${input}",
          },
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 42,
            "input": "${input}",
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
          importIdentifier: 'hbs',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 61,
            "input": "${input}",
          },
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 51,
            "input": "${input}",
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
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 56,
            "input": "${input}",
          },
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 46,
            "input": "${input}",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with (default) import ember-cli-htmlbars-inline-precompile', function () {
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
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 72,
            "input": "${input}",
          },
          "start": Object {
            "0": "theHbs\`",
            "1": "theHbs",
            "groups": undefined,
            "index": 59,
            "input": "${input}",
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
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 56,
            "input": "${input}",
          },
          "start": Object {
            "0": "hbs\`",
            "1": "hbs",
            "groups": undefined,
            "index": 46,
            "input": "${input}",
          },
          "tagName": "hbs",
          "type": "template-literal",
        },
      ]
    `);
  });

  it('hbs`Hello!` with import @ember/template-compilation', function () {
    const input =
      "import { precompileTemplate } from '@ember/template-compilation'; precompileTemplate`Hello!`";

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
      templateLiteral: [
        {
          importPath: '@ember/template-compilation',
          importIdentifier: 'precompileTemplate',
        },
      ],
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "end": Object {
            "0": "\`",
            "1": undefined,
            "groups": undefined,
            "index": 91,
            "input": "${input}",
          },
          "start": Object {
            "0": "precompileTemplate\`",
            "1": "precompileTemplate",
            "groups": undefined,
            "index": 66,
            "input": "${input}",
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
        end: {
          0: '`',
          1: undefined,
          groups: undefined,
          index: 123,
          input,
        },
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

  it('lol`hahahaha`', function () {
    const input = 'lol`hahaha`';

    const templates = parseTemplates(input, 'foo.js', {
      templateTag: 'template',
    });

    expect(templates).toMatchInlineSnapshot(`
      Array [
        Object {
          "end": Object {
            "0": "\`",
            "index": 10,
          },
          "start": Object {
            "0": "lol\`",
            "1": "lol",
            "groups": undefined,
            "index": 0,
            "input": "lol\`hahaha\`",
          },
          "tagName": "lol",
          "type": "template-literal",
        },
      ]
    `);
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
