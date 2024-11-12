const stew = require('broccoli-stew');

const { Preprocessor } = require('content-tag');

module.exports = class TemplateImportPreprocessor {
  #processor;
  #inline_source_map;

  constructor({ inline_source_map = false }) {
    this.name = 'template-imports-preprocessor';
    this.#inline_source_map = inline_source_map;
    this.#processor = new Preprocessor();
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.{gjs,gts}`, (string, relativePath) => {
      let { code: transformed } = this.#processor.process(string, {
        filename: relativePath,
        inline_source_map: this.#inline_source_map,
      });

      return transformed;
    });

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gjs$/, '.js').replace(/\.gts$/, '.ts');
    });
  }
};
