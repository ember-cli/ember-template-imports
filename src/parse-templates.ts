import parseStaticImports from 'parse-static-imports';
import * as htmlparser2 from 'htmlparser2';
import Parser from '@babel/parser/lib/parser';
import traverse, { NodePath } from '@babel/traverse';
import { ClassBody, Identifier, MemberExpression, Node } from '@babel/types';
import {
  TEMPLATE_TAG_NAME,
  TEMPLATE_LITERAL_MODULE_SPECIFIER,
  TEMPLATE_LITERAL_IDENTIFIER,
} from './util';

export type TemplateMatch = TemplateTagMatch | TemplateLiteralMatch;

export type Match = { start: number; end: number };

export interface TemplateTagMatch {
  type: 'template-tag';
  tagName: string;
  startRange: Match;
  endRange: Match;
  start: RegExpMatchArray;
  end: RegExpMatchArray;
  contents: string;
  contentRange: [number, number];
  range: [number, number];
  prefix?: string;
}

export interface TemplateLiteralMatch {
  type: 'template-literal';
  tagName: string;
  contents: string;
  startRange: Match;
  endRange: Match;
  start: RegExpMatchArray;
  end: RegExpMatchArray;
  contentRange: [number, number];
  range: [number, number];
  importPath: string;
  importIdentifier: string;
  prefix?: string;
}

export function isTemplateLiteralMatch(
  template: TemplateTagMatch | TemplateLiteralMatch
): template is TemplateLiteralMatch {
  return template.type === 'template-literal';
}

/**
 * Represents a static import of a template literal.
 */
export interface StaticImportConfig {
  /**
   * The path to the package from which we want to import the template literal
   * (e.g.: 'ember-cli-htmlbars')
   */
  importPath: string;
  /**
   * The name of the template literal (e.g.: 'hbs') or 'default' if this package
   * exports a default function
   */
  importIdentifier: string;
}

/**
 * The input options to instruct parseTemplates on how to parse the input.
 *
 * @param templateTag
 * @param templateLiteral
 */
export interface ParseTemplatesOptions {
  /** Tag to use, if parsing template tags is enabled. */
  templateTag?: string;
  /** Which static imports are expected in this template. */
  templateLiteral?: StaticImportConfig[];
}

function replaceRange(
  s: string,
  start: number,
  end: number,
  substitute: string
) {
  return s.substring(0, start) + substitute + s.substring(end);
}

function minify(htmlContent: string) {
  let newHtmlContent = htmlContent;
  const replaceList: { start: number; end: number; content: string }[] = [];
  const htmlParser = new htmlparser2.Parser({
    ontext(data: string) {
      replaceList.push({
        start: htmlParser.startIndex,
        end: htmlParser.endIndex + 1,
        content: data.replace(/ {2,}/g, ' ').replace(/[\r\n\t\f\v]/g, ''),
      });
    },
  });
  htmlParser.write(htmlContent);
  htmlParser.end();
  replaceList.reverse().forEach((r) => {
    newHtmlContent = replaceRange(newHtmlContent, r.start, r.end, r.content);
  });
  return newHtmlContent;
}

export const DEFAULT_PARSE_TEMPLATES_OPTIONS = {
  templateTag: TEMPLATE_TAG_NAME,
  templateLiteral: [
    {
      importPath: 'ember-cli-htmlbars',
      importIdentifier: 'hbs',
    },
    {
      importPath: '@ember/template-compilation',
      importIdentifier: 'hbs',
    },
    {
      importPath: TEMPLATE_LITERAL_MODULE_SPECIFIER,
      importIdentifier: TEMPLATE_LITERAL_IDENTIFIER,
    },
    {
      importPath: 'ember-cli-htmlbars-inline-precompile',
      importIdentifier: 'default',
    },
    {
      importPath: 'htmlbars-inline-precompile',
      importIdentifier: 'default',
    },
    {
      importPath: '@ember/template-compilation',
      importIdentifier: 'precompileTemplate',
    },
  ],
};

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
  const templateLiteralConfig = options?.templateLiteral;

  let importedNames = new Map<string, StaticImportConfig>();
  if (templateLiteralConfig) {
    importedNames = findImportedNames(template, templateLiteralConfig);
  }

  type EmberNode = Node & {
    tagName: string;
    content: string;
    tagProperties: Record<string, string | undefined>;
    startRange: [number, number];
    endRange: [number, number];
    contentRange: [number, number];
  };

  class TemplateParser extends Parser {
    isInsideTemplate = false;
    parseEmberTemplate(...args: any) {
      let openTemplates = 0;
      const contentRange = [0, 0] as [number, number];
      if (
        templateTag &&
        this.state.value === '<' &&
        this.input.slice(this.state.pos).startsWith(templateTag)
      ) {
        const node = this.startNode() as EmberNode;
        this.isInsideTemplate = true;
        node.tagName = templateTag;
        openTemplates += 1;
        node.startRange = [this.state.pos - 1, this.state.pos];
        let value = this.state.value;
        while (value !== '>') {
          this.next();
          value = this.state.value;
        }
        const properties = template
          .slice(node.startRange[0], this.state.pos - 1)
          .split(' ')
          .slice(1)
          .filter((x) => !!x)
          .map((p) => p.split('='));
        node.tagProperties = {};
        properties.forEach((p) => {
          node.tagProperties[p[0]] = p.slice(1).length
            ? p.slice(1).join('=')
            : undefined;
        });
        node.startRange[1] = this.state.pos;
        contentRange[0] = this.state.pos;
        while (openTemplates) {
          if (
            this.state.value === '<' &&
            this.input.slice(this.state.pos).startsWith(templateTag)
          ) {
            openTemplates += 1;
          }

          if (
            this.state.value === '<' &&
            this.input.slice(this.state.pos).startsWith(`/${templateTag}>`)
          ) {
            node.endRange = [this.state.pos - 1, this.state.pos];
            openTemplates -= 1;
            if (openTemplates === 0) {
              contentRange[1] = this.state.pos - 1;
              value = this.state.value;
              while (value !== '>') {
                this.next();
                value = this.state.value;
              }
              node.endRange[1] = this.state.pos;
              node.content = this.input.slice(...contentRange);
              node.contentRange = contentRange;
              this.isInsideTemplate = false;
              this.next();
              return this.finishNode(node, 'EmberTemplate');
            }
          }
          this.next();
        }
      }
      return null;
    }

    isAlphaNumeric(code: number) {
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        return false;
      }
      return true;
    }

    getTokenFromCode(code: number) {
      if (this.isInsideTemplate) {
        if (!this.isAlphaNumeric(code)) {
          ++this.state.pos;
          this.finishToken(code.toString(), String.fromCharCode(code));
          return;
        }
      }
      return super.getTokenFromCode(code);
    }

    parseStatementLike(...args: any) {
      return this.parseEmberTemplate() ?? super.parseStatementLike(...args);
    }

    parseMaybeAssign(...args: any) {
      return this.parseEmberTemplate() ?? super.parseMaybeAssign(...args);
    }

    parseClassMember(
      classBody: ClassBody,
      member: MemberExpression,
      state: any
    ) {
      const node = this.parseEmberTemplate();
      if (node) {
        classBody.body.push(node as any);
        return node;
      }
      return super.parseClassMember(classBody, member, state);
    }
  }
  const templateParser = new TemplateParser(
    {
      ranges: true,
      allowImportExportEverywhere: true,
      errorRecovery: true,
      plugins: ['typescript', 'decorators'],
    },
    template
  );
  const ast = templateParser.parse();

  traverse(ast, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _verified: true,
    EmberTemplate(path: NodePath<EmberNode>) {
      const node = path.node;

      const originalContent = node.content;
      let content = originalContent;
      if ('trim' in node.tagProperties) {
        content = content.trim();
      }

      if ('minify' in node.tagProperties) {
        content = minify(content);
      }

      results.push({
        type: 'template-tag',
        tagName: node.tagName,
        contents: content,
        contentRange: node.contentRange,
        range: node.range!,
        start: {
          index: node.range![0],
          0: originalContent,
        } as unknown as RegExpMatchArray,
        end: {
          index: node.endRange[0],
          0: template.slice(...node.endRange),
        } as unknown as RegExpMatchArray,
        startRange: {
          start: node.startRange[0],
          end: node.startRange[1],
        },
        endRange: { start: node.endRange[0], end: node.endRange[1] },
      });
    },
    TaggedTemplateExpression(path) {
      const node = path.node;
      const tagName = (node.tag as Identifier).name;
      const importConfig = importedNames.get(tagName);
      if (importConfig && node.quasi.quasis.length === 1) {
        const contents = template.slice(
          node.quasi.quasis[0].start!,
          node.quasi.quasis[0].end!
        );
        results.push({
          type: 'template-literal',
          tagName,
          contents,
          start: {
            index: node.tag.range![0],
            0: contents,
          } as unknown as RegExpMatchArray,
          end: {
            index: node.range![1] - 1,
            0: '`',
          } as unknown as RegExpMatchArray,
          startRange: {
            start: node.tag.range![0],
            end: node.tag.range![1] + 1,
          },
          endRange: { start: node.range![1] - 1, end: node.range![1] },
          range: node.range!,
          contentRange: [node.tag.range![1], node.range![1] - 1],
          importPath: importConfig.importPath,
          importIdentifier: importConfig.importIdentifier,
        });
      }
    },
  });
  return results;
}

function findImportedNames(
  template: string,
  importConfig: StaticImportConfig[]
): Map<string, StaticImportConfig> {
  const importedNames = new Map<string, StaticImportConfig>();

  for (const $import of parseStaticImports(template)) {
    for (const $config of findImportConfigByImportPath(
      importConfig,
      $import.moduleName
    )) {
      if ($import.defaultImport && $config.importIdentifier === 'default') {
        importedNames.set($import.defaultImport, $config);
      }
      const match = $import.namedImports.find(
        ({ name }) => $config.importIdentifier === name
      );
      if (match) {
        const localName = match.alias || match.name;
        importedNames.set(localName, $config);
      }
    }
  }

  return importedNames;
}

function findImportConfigByImportPath(
  importConfig: StaticImportConfig[],
  importPath: string
): StaticImportConfig[] {
  return importConfig.filter((config) => config.importPath === importPath);
}
