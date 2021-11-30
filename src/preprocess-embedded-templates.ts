import MagicString from 'magic-string';
import path from 'path';
import parseStaticImports from 'parse-static-imports';
import lineColumn from 'line-column';
import { expect } from './debug';
import { parseTemplates, TemplateMatch } from './parse-templates';

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
    start: expect(match.index, 'Expected regular expression match to have an index'),
    end:
      expect(match.index, 'Expected regular expression match to have an index') + match[0].length,
  };
}

function findImportedName(
  template: string,
  importPath: string,
  importIdentifier: string
): string | undefined {
  for (const $import of parseStaticImports(template)) {
    if ($import.moduleName === importPath) {
      const match = $import.namedImports.find(({ name }) => name === importIdentifier);

      return match?.alias || match?.name;
    }
  }

  return undefined;
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

function loadGetTemplateLocals(path: string, exportPath: string): GetTemplateLocals {
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
  includeTemplateTokens: boolean
): Replacement[] {
  const { start: openStart, end: openEnd } = getMatchStartAndEnd(match.start);
  const { start: closeStart, end: closeEnd } = getMatchStartAndEnd(match.end);

  let options = '';

  if (includeTemplateTokens) {
    const tokensString = getTemplateLocals(template.slice(openEnd, closeStart))
      .filter((local: string) => local.match(/^[$A-Z_][0-9A-Z_$]*$/i))
      .join(',');

    if (tokensString.length > 0) {
      options = `, { scope() { return {${tokensString}}; } }`;
    }
  }

  const newStart = `${startReplacement}\``;
  const newEnd = `\`${options}${endReplacement}`;

  s.overwrite(openStart, openEnd, newStart);
  s.overwrite(closeStart, closeEnd, newEnd);

  return [
    replacementFrom(template, openStart, openEnd - openStart, newStart.length, 'start'),
    replacementFrom(template, closeStart, closeEnd - closeStart, newEnd.length, 'end'),
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
export default function preprocessEmbeddedTemplates(
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

  let { importIdentifier } = options;

  if ('getTemplateLocals' in options) {
    getTemplateLocals = options.getTemplateLocals;
  } else {
    getTemplateLocals = loadGetTemplateLocals(
      options.getTemplateLocalsRequirePath,
      options.getTemplateLocalsExportPath
    );
  }

  if (importPath && importIdentifier) {
    importIdentifier = findImportedName(template, importPath, importIdentifier);

    if (!importIdentifier) {
      return {
        output: template,
        replacements: [],
      };
    }
  }

  const matches = parseTemplates(template, relativePath, templateTag);
  const replacements: Replacement[] = [];
  const s = new MagicString(template);

  for (const match of matches) {
    if (match.type === 'template-literal' && match.tagName === importIdentifier) {
      replacements.push(
        ...replaceMatch(
          s,
          match,
          `${match.tagName}(`,
          ')',
          template,
          getTemplateLocals,
          includeTemplateTokens
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
          includeTemplateTokens
        )
      );
    }
  }

  let output = s.toString();

  if (includeSourceMaps) {
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
