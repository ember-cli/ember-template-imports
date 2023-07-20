import MagicString from 'magic-string';
import path from 'path';
import lineColumn from 'line-column';
import { expect } from './debug';
import {
  parseTemplates,
  ParseTemplatesOptions,
  TemplateMatch,
} from './parse-templates';

interface PreprocessOptionsEager {
  getTemplateLocals: GetTemplateLocals;

  importIdentifier?: string;
  importPath?: string;
  templateTag?: string;
  templateTagReplacement?: string;

  relativePath: string;
  includeSourceMaps: boolean;
  includeTemplateTokens: boolean;
}

interface PreprocessOptionsLazy {
  getTemplateLocalsRequirePath: string;
  getTemplateLocalsExportPath: string;

  importIdentifier?: string;
  importPath?: string;
  templateTag?: string;
  templateTagReplacement?: string;

  relativePath: string;
  includeSourceMaps: boolean;
  includeTemplateTokens: boolean;
}

type PreprocessOptions = PreprocessOptionsLazy | PreprocessOptionsEager;

interface PreprocessedOutput {
  output: string;
  replacements: Replacement[];
}

interface Replacement {
  type: 'start' | 'end';
  index: number;
  oldLength: number;
  newLength: number;
  originalLine: number;
  originalCol: number;
}

type GetTemplateLocals = (template: string) => string[];

function getMatchStartAndEnd(match: RegExpMatchArray) {
  return {
    start: expect(
      match.index,
      'Expected regular expression match to have an index'
    ),
    end:
      expect(
        match.index,
        'Expected regular expression match to have an index'
      ) + match[0].length,
  };
}

function replacementFrom(
  template: string,
  index: number,
  oldLength: number,
  newLength: number,
  type: 'start' | 'end'
): Replacement {
  const loc = expect(
    lineColumn(template).fromIndex(index),
    'BUG: expected to find a line/column based on index'
  );

  return {
    type,
    index,
    oldLength,
    newLength,
    originalCol: loc.col,
    originalLine: loc.line,
  };
}

function loadGetTemplateLocals(
  path: string,
  exportPath: string
): GetTemplateLocals {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const templateLocals = require(path);

  let getTemplateLocals = templateLocals;

  for (const segment of exportPath.split('.')) {
    getTemplateLocals = getTemplateLocals[segment];
  }

  return getTemplateLocals;
}

function replaceMatch(
  s: MagicString,
  match: TemplateMatch,
  startReplacement: string,
  endReplacement: string,
  template: string,
  getTemplateLocals: GetTemplateLocals,
  includeTemplateTokens: boolean,
  relativePath: string
): Replacement[] {
  const { start: openStart, end: openEnd } = getMatchStartAndEnd(match.start);
  const { start: closeStart, end: closeEnd } = getMatchStartAndEnd(match.end);

  let options = '';

  if (includeTemplateTokens) {
    const tokensString = getTemplateLocals(template.slice(openEnd, closeStart))
      .filter((local: string) => local.match(/^[$A-Z_][0-9A-Z_$]*$/i))
      .join(',');

    if (tokensString.length > 0) {
      options = `, scope: () => ({${tokensString}})`;
    }
  }

  const newStart = `${startReplacement}\``;
  const newEnd = `\`, { strictMode: true, moduleName: '${relativePath}'${options} }${endReplacement}`;

  s.overwrite(openStart, openEnd, newStart);
  s.overwrite(closeStart, closeEnd, newEnd);
  ensureBackticksEscaped(s, openEnd + 1, closeStart - 1);

  return [
    replacementFrom(
      template,
      openStart,
      openEnd - openStart,
      newStart.length,
      'start'
    ),
    replacementFrom(
      template,
      closeStart,
      closeEnd - closeStart,
      newEnd.length,
      'end'
    ),
  ];
}

/**
 * Preprocesses all embedded templates within a JavaScript or TypeScript file.
 * This function replaces all embedded templates that match our template syntax
 * with valid, parseable JS. Optionally, it can also include a source map, and
 * it can also include all possible values used within the template.
 *
 * Input:
 *
 *   <template><MyComponent/><template>
 *
 * Output:
 *
 *   [GLIMMER_TEMPLATE(`<MyComponent/>`, { scope() { return {MyComponent}; } })];
 *
 * It can also be used with template literals to provide the in scope values:
 *
 * Input:
 *
 *   hbs`<MyComponent/>`;
 *
 * Output
 *
 *   hbs(`<MyComponent/>`, { scope() { return {MyComponent}; } });
 */
export function preprocessEmbeddedTemplates(
  template: string,
  options: PreprocessOptions
): PreprocessedOutput {
  let getTemplateLocals: GetTemplateLocals;

  const {
    importPath,
    templateTag,
    templateTagReplacement,
    includeSourceMaps,
    includeTemplateTokens,
    relativePath,
  } = options;

  const { importIdentifier } = options;

  if ('getTemplateLocals' in options) {
    getTemplateLocals = options.getTemplateLocals;
  } else {
    getTemplateLocals = loadGetTemplateLocals(
      options.getTemplateLocalsRequirePath,
      options.getTemplateLocalsExportPath
    );
  }

  const parseTemplatesOptions: ParseTemplatesOptions = {
    templateTag,
  };

  if (importPath && importIdentifier) {
    parseTemplatesOptions.templateLiteral = [
      {
        importPath,
        importIdentifier,
      },
    ];
  }

  const matches = parseTemplates(template, relativePath, parseTemplatesOptions);
  const replacements: Replacement[] = [];
  const s = new MagicString(template);

  for (const match of matches) {
    if (
      match.type === 'template-literal' &&
      match.tagName === importIdentifier
    ) {
      replacements.push(
        ...replaceMatch(
          s,
          match,
          `${match.tagName}(`,
          ')',
          template,
          getTemplateLocals,
          includeTemplateTokens,
          relativePath
        )
      );
    } else if (match.type === 'template-tag') {
      replacements.push(
        ...replaceMatch(
          s,
          match,
          `[${templateTagReplacement}(`,
          ')]',
          template,
          getTemplateLocals,
          includeTemplateTokens,
          relativePath
        )
      );
    }
  }

  let output = s.toString();

  const hasChanges = template !== output;
  if (includeSourceMaps && hasChanges) {
    const { dir, name } = path.parse(relativePath);

    const map = s.generateMap({
      file: `${dir}/${name}.js`,
      source: relativePath,
      includeContent: true,
      hires: true,
    });

    output += `\n//# sourceMappingURL=${map.toUrl()}`;
  }

  return {
    output,
    replacements,
  };
}

function ensureBackticksEscaped(s: MagicString, start: number, end: number) {
  let content = s.slice(start, end);
  content = content.replace(/(?<!\\)`/g, '\\`');
  s.overwrite(start, end, content, false);
}
