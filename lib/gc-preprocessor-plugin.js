const stew = require('broccoli-stew');

const IMPORT = `import { hbs } from 'ember-template-imports';`;

module.exports = class GlimmerComponentPreprocessor {
  constructor() {
    this.name = 'glimmer-component-preprocessor';
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.gc`, (contents) => {
      const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/i;
      const scriptTag = contents.match(scriptRegex);

      if (scriptTag) {
        const template = contents.replace(scriptRegex, '');
        let script = scriptTag[1].trim();

        // need to check for class here
        const signatureRegex = /export default class [^{]*? {/gi;
        const signature = script.match(signatureRegex);

        if (signature) {
          script = script.replace(
            signature,
            `${signature}\n  static template = hbs\`${template}\`;\n`
          );

          return `${IMPORT} ${script}`;
        }

        return `${IMPORT} ${script} export default hbs\`${template}\`;`;
      }

      return `${IMPORT} export default hbs\`${contents}\`;`;
    });

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gc$/, '.js');
    });
  }
};
