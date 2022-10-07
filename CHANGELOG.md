Deprecated as of 10.7.0. highlight(lang, code, ...args) has been deprecated.
Deprecated as of 10.7.0. Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277

## v3.1.2 (2022-10-07)

#### :bug: Bug Fix
* [#51](https://github.com/ember-template-imports/ember-template-imports/pull/51) Stop trying to tokenize regexes to avoid confusing bug caused by division appearing in a file before a <template> tag ([@lukemelia](https://github.com/lukemelia))
* [#54](https://github.com/ember-template-imports/ember-template-imports/pull/54) Fix build failures due to backticks within in template tags ([@lukemelia](https://github.com/lukemelia))

#### :memo: Documentation
* [#55](https://github.com/ember-template-imports/ember-template-imports/pull/55) Fix parse function comments ([@backspace](https://github.com/backspace))

#### Committers: 3
- Buck Doyle ([@backspace](https://github.com/backspace))
- Luke Melia ([@lukemelia](https://github.com/lukemelia))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v3.1.1 (2022-08-28)

#### :bug: Bug Fix
* [#50](https://github.com/ember-template-imports/ember-template-imports/pull/50) Include the correct import name in `parseTemplates` results ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v3.1.0 (2022-08-24)

#### :rocket: Enhancement
* [#47](https://github.com/ember-template-imports/ember-template-imports/pull/47) Update `TemplateLiteralMatch` to include source `importPath` and `importIdentifier` ([@nlfurniss](https://github.com/nlfurniss))

#### Committers: 1
- Nathaniel Furniss ([@nlfurniss](https://github.com/nlfurniss))


## v3.0.1 (2022-06-07)

#### :bug: Bug Fix
* [#41](https://github.com/ember-template-imports/ember-template-imports/pull/41) Correctly support multiple template parsing fn from same path ([@ventuno](https://github.com/ventuno))

#### :house: Internal
* [#40](https://github.com/ember-template-imports/ember-template-imports/pull/40) Improve parallelization in CI ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 2
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- [@ventuno](https://github.com/ventuno)


## v3.0.0 (2022-05-18)

#### :boom: Breaking Change
* [#37](https://github.com/ember-template-imports/ember-template-imports/pull/37) Update parseTemplates to filter by tagName ([@ventuno](https://github.com/ventuno))

#### :rocket: Enhancement
* [#37](https://github.com/ember-template-imports/ember-template-imports/pull/37) Update parseTemplates to filter by tagName ([@ventuno](https://github.com/ventuno))

#### :memo: Documentation
* [#34](https://github.com/ember-template-imports/ember-template-imports/pull/34) Fix broken link ([@kaermorchen](https://github.com/kaermorchen))
* [#24](https://github.com/ember-template-imports/ember-template-imports/pull/24) start a README section for editor integration links ([@ef4](https://github.com/ef4))
* [#32](https://github.com/ember-template-imports/ember-template-imports/pull/32) Fix missing quotes in reference-imports section ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :house: Internal
* [#36](https://github.com/ember-template-imports/ember-template-imports/pull/36) Adds a basic node-land test harness. ([@rwjblue](https://github.com/rwjblue))

#### Committers: 5
- Edward Faulkner ([@ef4](https://github.com/ef4))
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))
- Stanislav Romanov ([@kaermorchen](https://github.com/kaermorchen))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@ventuno](https://github.com/ventuno)

## v2.0.1 (2022-01-01)

#### :bug: Bug Fix
* [#30](https://github.com/ember-template-imports/ember-template-imports/pull/30) declare magic string dependency ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#29](https://github.com/ember-template-imports/ember-template-imports/pull/29) Do not add the babel plugin if it's already present ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :memo: Documentation
* [#27](https://github.com/ember-template-imports/ember-template-imports/pull/27) Add reference for built-in helpers/modifiers/components ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)


## v2.0.0 (2021-12-15)

#### :boom: Breaking Change
* [#25](https://github.com/ember-template-imports/ember-template-imports/pull/25) Support Embroider + HTMLBars 6 ([@dfreeman](https://github.com/dfreeman))

#### Committers: 1
- Dan Freeman ([@dfreeman](https://github.com/dfreeman))


## v1.1.1 (2021-03-25)

#### :bug: Bug Fix
* [#16](https://github.com/ember-template-imports/ember-template-imports/pull/16) Make getting the template compiler path lazy ([@pzuraq](https://github.com/pzuraq))

#### Committers: 1
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))


## v1.1.0 (2021-03-25)

#### :rocket: Enhancement
* [#15](https://github.com/ember-template-imports/ember-template-imports/pull/15) Update to using babel-plugin-htmlbars-inline-precompile preprocessor ([@pzuraq](https://github.com/pzuraq))

#### Committers: 2
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- Eric Kelly ([@HeroicEric](https://github.com/HeroicEric))


## v1.0.1 (2021-02-25)

#### :bug: Bug Fix
* [#5](https://github.com/ember-template-imports/ember-template-imports/pull/5) Ensure this addon is included before ember-cli-htmlbars ([@pzuraq](https://github.com/pzuraq))

#### Committers: 2
- Chris Garrett ([@pzuraq](https://github.com/pzuraq))
- James C. Davis ([@jamescdavis](https://github.com/jamescdavis))

## v1.0.0 (2021-02-25)

# Changelog
