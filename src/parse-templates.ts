import matchAll from 'string.prototype.matchall';

import { TEMPLATE_TAG_NAME } from './util';
import { expect } from './debug';

export type TemplateMatch = TemplateTagMatch;

export interface TemplateTagMatch {
  type: 'template-tag';
  tagName: string;
  start: RegExpMatchArray;
  end: RegExpMatchArray;
  contents: string;
}

/**
 * The input options to instruct parseTemplates on how to parse the input.
 *
 * @param templateTag
 */
export interface ParseTemplatesOptions {
  /** Tag to use, if parsing template tags is enabled. */
  templateTag?: string;
}

const escapeChar = '\\';
const stringDelimiter = /['"]/;

const singleLineCommentStart = /\/\//;
const newLine = /\n/;
const multiLineCommentStart = /\/\*/;
const multiLineCommentEnd = /\*\//;

const templateLiteralStart = /([$a-zA-Z_][0-9a-zA-Z_$]*)?`/;
const templateLiteralEnd = /`/;

const dynamicSegmentStart = /\${/;
const blockStart = /{/;
const dynamicSegmentEnd = /}/;

function isEscaped(template: string, _offset: number | undefined) {
  let offset = expect(_offset, 'Expected an index to check escaping');

  let count = 0;

  while (template[offset - 1] === escapeChar) {
    count++;
    offset--;
  }

  return count % 2 === 1;
}

export const DEFAULT_PARSE_TEMPLATES_OPTIONS = {
  templateTag: TEMPLATE_TAG_NAME,
};

/**
 * Parses a template to find all possible valid matches for an embedded template.
 * Template tags are the only supported syntax
 *
 *   <template></template>
 *
 * The parser excludes any values found within strings recursively, and also
 * excludes any string literals with dynamic segments (e.g `${}`) since these
 * cannot be valid templates.
 *
 * @param template The template to parse
 * @param relativePath Relative file path for the template (for errors)
 * @param options optional configuration options for how to parse templates
 * @returns
 */
export function parseTemplates(
  template: string,
  relativePath: string,
  options: ParseTemplatesOptions = DEFAULT_PARSE_TEMPLATES_OPTIONS
): TemplateMatch[] {
  const results: TemplateMatch[] = [];
  const templateTag = options?.templateTag;

  const templateTagStart = new RegExp(`<${templateTag}[^<]*>`);
  const templateTagEnd = new RegExp(`</${templateTag}>`);
  const argumentsMatchRegex = new RegExp(`<${templateTag}[^<]*\\S[^<]*>`);

  const allTokens = new RegExp(
    [
      singleLineCommentStart.source,
      newLine.source,
      multiLineCommentStart.source,
      multiLineCommentEnd.source,
      stringDelimiter.source,
      templateLiteralStart.source,
      templateLiteralEnd.source,
      dynamicSegmentStart.source,
      dynamicSegmentEnd.source,
      blockStart.source,
      templateTagStart.source,
      templateTagEnd.source,
    ].join('|'),
    'g'
  );

  const tokens = Array.from(matchAll(template, allTokens));

  while (tokens.length > 0) {
    const currentToken = tokens.shift()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

    parseToken(results, template, currentToken, tokens, true);
  }

  /**
   * Parse the current token. If top level, then template tags can be parsed.
   * Else, we are nested within a dynamic segment, which is currently unsupported.
   */
  function parseToken(
    results: TemplateMatch[],
    template: string,
    token: RegExpMatchArray,
    tokens: RegExpMatchArray[],
    isTopLevel = false
  ) {
    if (token[0].match(multiLineCommentStart)) {
      parseMultiLineComment(results, template, token, tokens);
    } else if (token[0].match(singleLineCommentStart)) {
      parseSingleLineComment(results, template, token, tokens);
    } else if (token[0].match(templateLiteralStart)) {
      parseTemplateLiteral(template, tokens);
    } else if (
      isTopLevel &&
      templateTag !== undefined &&
      templateTagStart &&
      token[0].match(templateTagStart)
    ) {
      parseTemplateTag(results, template, token, tokens, templateTag);
    } else if (token[0].match(stringDelimiter)) {
      parseString(results, template, token, tokens);
    }
  }

  /**
   * Parse a string. All tokens within a string are ignored
   * since there are no dynamic segments within these.
   */
  function parseString(
    _results: TemplateMatch[],
    template: string,
    startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[]
  ) {
    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (
        currentToken[0] === startToken[0] &&
        !isEscaped(template, currentToken.index)
      ) {
        return;
      }
    }
  }

  /**
   * Parse a single-line comment. All tokens within a single-line comment are ignored
   * since there are no dynamic segments within them.
   */
  function parseSingleLineComment(
    _results: TemplateMatch[],
    _template: string,
    _startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[]
  ) {
    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (currentToken[0] === '\n') {
        return;
      }
    }
  }

  /**
   * Parse a multi-line comment. All tokens within a multi-line comment are ignored
   * since there are no dynamic segments within them.
   */
  function parseMultiLineComment(
    _results: TemplateMatch[],
    _template: string,
    _startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[]
  ) {
    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (currentToken[0] === '*/') {
        return;
      }
    }
  }

  /**
   * Parse a template literal. If a dynamic segment is found, enters the dynamic
   * segment and parses it recursively. If no dynamic segments are found and the
   * literal is top level (e.g. not nested within a dynamic segment) and has a
   * tag, pushes it into the list of results.
   */
  function parseTemplateLiteral(template: string, tokens: RegExpMatchArray[]) {
    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (isEscaped(template, currentToken.index)) continue;

      if (currentToken[0].match(templateLiteralEnd)) {
        return;
      }
    }
  }

  /**
   * Parses a template tag. Continues parsing until the template tag has closed,
   * accounting for nested template tags.
   */
  function parseTemplateTag(
    results: TemplateMatch[],
    _template: string,
    startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[],
    templateTag: string
  ) {
    let stack = 1;

    if (argumentsMatchRegex && startToken[0].match(argumentsMatchRegex)) {
      throw new Error(
        `embedded template preprocessing currently does not support passing arguments, found args in: ${relativePath}`
      );
    }

    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (currentToken[0].match(templateTagStart)) {
        stack++;
      } else if (currentToken[0].match(templateTagEnd)) {
        stack--;
      }

      if (stack === 0) {
        let contents = '';

        if (startToken.index !== undefined) {
          const templateStart = startToken.index + startToken[0].length;

          contents = template.slice(templateStart, currentToken.index);
        }

        results.push({
          type: 'template-tag',
          tagName: templateTag,
          contents: contents,
          start: startToken,
          end: currentToken,
        });

        return;
      }
    }
  }

  return results;
}
