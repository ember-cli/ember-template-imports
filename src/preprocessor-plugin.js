const stew = require('broccoli-stew');

const { Preprocessor } = require('content-tag');

module.exports = class TemplateImportPreprocessor {
  #processor;

  constructor() {
    this.name = 'template-imports-preprocessor';
    this.#processor = new Preprocessor();
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.{gjs,gts}`, (string, relativePath) => {
      let transformed = this.#processor.process(string, relativePath);

      return transformed;
    });

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gjs$/, '.js').replace(/\.gts$/, '.ts');
    });
  }
};
