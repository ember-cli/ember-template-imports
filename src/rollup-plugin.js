import fs from 'node:fs/promises';
import path from 'node:path';
import { preprocessEmbeddedTemplates } from './preprocess-embedded-templates';
import {
  TEMPLATE_TAG_NAME,
  TEMPLATE_TAG_PLACEHOLDER,
} from './util';

export default function firstClassComponentTemplates() {
  return {
    name: 'preprocess-fccts',
    async resolveId(source, importer, options) {
      if (source.endsWith('.hbs')) return;

      for (let ext of ['', '.gjs', '.gts']) {
        let result = await this.resolve(source + ext, importer, {
          ...options,
          skipSelf: true,
        });

        if (result?.external) {
          return;
        }

        if (FCCT_EXTENSION.test(result?.id)) {
          return resolutionFor(result.id);
        }
      }
    },

    async load(id) {
      let originalId = this.getModuleInfo(id)?.meta?.fccts?.originalId ?? id;

      if (originalId !== id) {
        this.addWatchFile(originalId);
      }

      if (FCCT_EXTENSION.test(originalId)) {
        return await preprocessTemplates(originalId);
      }
    },
  };
}

const FCCT_EXTENSION = /\.g([jt]s)$/;

function resolutionFor(originalId) {
  return {
    id: originalId.replace(FCCT_EXTENSION, '.$1'),
    meta: {
      fccts: { originalId },
    },
  };
}

async function preprocessTemplates(id) {
  let ember = (await import('ember-source')).default;
  let contents = await fs.readFile(id, 'utf-8');

  // This is basically taken directly from `ember-template-imports`
  let result = preprocessEmbeddedTemplates(contents, {
    relativePath: path.relative('.', id),

    getTemplateLocalsRequirePath: ember.absolutePaths.templateCompiler,
    getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

    templateTag: TEMPLATE_TAG_NAME,
    templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

    includeSourceMaps: true,
    includeTemplateTokens: true,
  });

  return result.output;
}
