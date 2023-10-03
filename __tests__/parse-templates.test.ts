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
});
