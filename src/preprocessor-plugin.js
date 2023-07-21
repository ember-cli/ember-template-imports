const stew = require('broccoli-stew');
const { Preprocessor } = require('content-tag');

module.exports = class TemplateImportPreprocessor {
  constructor() {
    this.name = 'template-imports-preprocessor';
    this.preprocessor = new Preprocessor();
  }

  toTree(tree) {
    let compiled = stew.map(tree, `**/*.{gjs,gts}`, (string, relativePath) => {
      return this.preprocessor.process(string, relativePath);
    });

    return stew.rename(compiled, (name) => {
      return name.replace(/\.gjs$/, '.js').replace(/\.gts$/, '.ts');
    });
  }
};
