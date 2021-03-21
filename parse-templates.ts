import matchAll from 'string.prototype.matchall';
import { expect } from './debug';

export type TemplateMatch = TemplateTagMatch | TemplateLiteralMatch;

export interface TemplateTagMatch {
  type: 'template-tag';
  start: RegExpMatchArray;
  end: RegExpMatchArray;
}

export interface TemplateLiteralMatch {
  type: 'template-literal';
  tagName: string;
  start: RegExpMatchArray;
  end: RegExpMatchArray;
}

const escapeChar = '\\';
const stringOrRegexDelimiter = /['"/]/;

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

/**
 * Parses a template to find all possible valid matches for an embedded template.
 * Supported syntaxes are template literals:
 *
 *   hbs`Hello, world!`
 *
 * And template tags
 *
 *   <template></template>
 *
 * The parser excludes any values found within strings recursively, and also
 * excludes any string literals with dynamic segments (e.g `${}`) since these
 * cannot be valid templates.
 *
 * @param template The template to parse
 * @param relativePath Relative file path for the template (for errors)
 * @param templateTag Optional template tag if parsing template tags is enabled
 * @returns
 */
export function parseTemplates(
  template: string,
  relativePath: string,
  templateTag?: string
): TemplateMatch[] {
  const results: TemplateMatch[] = [];

  const templateTagStart = new RegExp(`<${templateTag}[^<]*>`);
  const templateTagEnd = new RegExp(`</${templateTag}>`);
  const argumentsMatchRegex = new RegExp(`<${templateTag}[^<]*\\S[^<]*>`);

  const allTokens = new RegExp(
    `["'\`/]|([$a-zA-Z_][0-9a-zA-Z_$]*)\`|\\\${|{|}|<${templateTag}[^<]*?>|<\\/${templateTag}>`,
    'g'
  );

  const tokens = Array.from(matchAll(template, allTokens));

  while (tokens.length > 0) {
    const currentToken = tokens.shift()!;

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
    if (token[0].match(stringOrRegexDelimiter)) {
      parseStringOrRegex(results, template, token, tokens);
    }

    if (token[0].match(templateLiteralStart)) {
      parseTemplateLiteral(results, template, token, tokens, isTopLevel);
    }

    if (
      isTopLevel &&
      templateTag !== undefined &&
      templateTagStart &&
      token[0].match(templateTagStart)
    ) {
      parseTemplateTag(results, template, token, tokens);
    }
  }

  /**
   * Parse a string or a regex. All tokens within a string or regex are ignored
   * since there are no dynamic segments within these.
   */
  function parseStringOrRegex(
    _results: TemplateMatch[],
    template: string,
    startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[]
  ) {
    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (currentToken[0] === startToken[0] && !isEscaped(template, currentToken.index)) {
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
  function parseTemplateLiteral(
    results: TemplateMatch[],
    template: string,
    startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[],
    isTopLevel = false
  ) {
    let hasDynamicSegment = false;

    while (tokens.length > 0) {
      let currentToken = expect(tokens.shift(), 'expected token');

      if (isEscaped(template, currentToken.index)) continue;

      if (currentToken[0].match(dynamicSegmentStart)) {
        hasDynamicSegment = true;

        parseDynamicSegment(results, template, currentToken, tokens);
      } else if (currentToken[0].match(templateLiteralEnd)) {
        if (isTopLevel && !hasDynamicSegment && startToken[1]?.length > 0) {
          // Handle the case where a tag-like was matched, e.g. hbs`hello`
          if (currentToken[0].length > 1) {
            const tokenStr = currentToken[0];
            const index = expect(currentToken.index, 'expected index');

            currentToken = ['`'];
            currentToken.index = index + tokenStr.length - 1;
          }

          results.push({
            type: 'template-literal',
            tagName: startToken[1],
            start: startToken,
            end: currentToken,
          });
        }

        return;
      }
    }
  }

  /**
   * Parses a dynamic segment within a template literal. Continues parsing until
   * the dynamic segment has been exited, ignoring all tokens within it.
   * Accounts for nested block statements, strings, and template literals.
   */
  function parseDynamicSegment(
    results: TemplateMatch[],
    template: string,
    _startToken: RegExpMatchArray,
    tokens: RegExpMatchArray[]
  ) {
    let stack = 1;

    while (tokens.length > 0) {
      const currentToken = expect(tokens.shift(), 'expected token');

      if (currentToken[0].match(blockStart)) {
        stack++;
      } else if (currentToken[0].match(dynamicSegmentEnd)) {
        stack--;
      } else {
        parseToken(results, template, currentToken, tokens);
      }

      if (stack === 0) {
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
    tokens: RegExpMatchArray[]
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
        results.push({ type: 'template-tag', start: startToken, end: currentToken });

        return;
      }
    }
  }

  return results;
}
