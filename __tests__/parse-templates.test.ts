import { parseTemplates as _parseTemplates } from '../src/parse-templates';

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
    templateTag: string
  ) {
    const results = _parseTemplates(source, relativePath, templateTag);

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

    const templates = parseTemplates(input, 'foo.gjs', 'template');

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

    const templates = parseTemplates(input, 'foo.js', 'template');

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

  it('lol`hahahaha`', function () {
    const input = 'lol`hahaha`';

    const templates = parseTemplates(input, 'foo.js', 'template');

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
});
