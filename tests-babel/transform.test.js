import babel from '@babel/core';
import { describe, expect, it } from 'vitest';
import { Preprocessor } from 'content-tag';
import plugin from '../src/babel-plugin.js';
import emberBabel from 'babel-plugin-ember-template-compilation';

describe('convert templates', () => {
  const p = new Preprocessor();

  it('should set explicit name for template only components', () => {
    const code = `
      const toc = <template>some content</template>;`;
    const preTransformed = p.process(code);

    const opts = {
      filename: '/tmp/path/my-app/node_modules/rewritten-app/components/a.hbs',
      plugins: [
        [
          plugin,
          {
            root: '/tmp/path/my-app',
          },
        ],
        ['@babel/plugin-proposal-decorators', { version: '2022-03' }],
        [
          emberBabel,
          {
            transforms: [],
            //targetFormat: 'hbs',
            compiler: require('ember-source/dist/ember-template-compiler'),
            enableLegacyModules: [
              'ember-cli-htmlbars',
              'ember-cli-htmlbars-inline-precompile',
              'htmlbars-inline-precompile',
            ],
          },
        ],
      ],
    };
    let result = babel.transform(preTransformed, opts);
    expect(result.code).toMatchInlineSnapshot(`
      "import { setComponentTemplate } from "@ember/component";
      import { createTemplateFactory } from "@ember/template-factory";
      import templateOnly from "@ember/component/template-only";
      const toc = setComponentTemplate(createTemplateFactory(
      /*
        some content
      */
      {
        "id": "xn207nfA",
        "block": "[[[1,\\"some content\\"]],[],false,[]]",
        "moduleName": "/rewritten-app/a.hbs",
        "isStrictMode": true
      }), templateOnly("a.hbs", "a:toc"));"
    `);

    // classic receives relative paths
    result = babel.transform(preTransformed, {
      ...opts,
      filename: '/my-app/components/a.hbs',
    });
    expect(result.code).toMatchInlineSnapshot(`
      "import { setComponentTemplate } from "@ember/component";
      import { createTemplateFactory } from "@ember/template-factory";
      import templateOnly from "@ember/component/template-only";
      const toc = setComponentTemplate(createTemplateFactory(
      /*
        some content
      */
      {
        "id": "xn207nfA",
        "block": "[[[1,\\"some content\\"]],[],false,[]]",
        "moduleName": "/rewritten-app/a.hbs",
        "isStrictMode": true
      }), templateOnly("a.hbs", "a:toc"));"
    `);

    result = babel.transform(preTransformed, {
      ...opts,
      filename: '/my-app/components/a/template.hbs',
    });
    expect(result.code).toMatchInlineSnapshot(`
      "import { setComponentTemplate } from "@ember/component";
      import { createTemplateFactory } from "@ember/template-factory";
      import templateOnly from "@ember/component/template-only";
      const toc = setComponentTemplate(createTemplateFactory(
      /*
        some content
      */
      {
        "id": "xn207nfA",
        "block": "[[[1,\\"some content\\"]],[],false,[]]",
        "moduleName": "/rewritten-app/a.hbs",
        "isStrictMode": true
      }), templateOnly("a.hbs", "a:toc"));"
    `);

    result = babel.transform(preTransformed, {
      ...opts,
      filename: '/my-app/components/a/component.gjs',
    });
    expect(result.code).toMatchInlineSnapshot(`
      "import { setComponentTemplate } from "@ember/component";
      import { createTemplateFactory } from "@ember/template-factory";
      import templateOnly from "@ember/component/template-only";
      const toc = setComponentTemplate(createTemplateFactory(
      /*
        some content
      */
      {
        "id": "xn207nfA",
        "block": "[[[1,\\"some content\\"]],[],false,[]]",
        "moduleName": "/rewritten-app/a.hbs",
        "isStrictMode": true
      }), templateOnly("a.hbs", "a:toc"));"
    `);

    result = babel.transform(preTransformed, {
      ...opts,
      filename: '/my-app/components/a/index.gjs',
    });
    expect(result.code).toMatchInlineSnapshot(`
      "import { setComponentTemplate } from "@ember/component";
      import { createTemplateFactory } from "@ember/template-factory";
      import templateOnly from "@ember/component/template-only";
      const toc = setComponentTemplate(createTemplateFactory(
      /*
        some content
      */
      {
        "id": "xn207nfA",
        "block": "[[[1,\\"some content\\"]],[],false,[]]",
        "moduleName": "/rewritten-app/a.hbs",
        "isStrictMode": true
      }), templateOnly("a.hbs", "a:toc"));"
    `);
  });
});
