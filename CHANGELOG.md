# Changelog

## Release (2025-02-01)

ember-template-imports 4.3.0 (minor)

#### :rocket: Enhancement
* `ember-template-imports`
  * [#277](https://github.com/ember-cli/ember-template-imports/pull/277) Enable `inline_source_map` by default ([@davidtaylorhq](https://github.com/davidtaylorhq))

#### :memo: Documentation
* `ember-template-imports`
  * [#273](https://github.com/ember-cli/ember-template-imports/pull/273) Update readme compatibility ([@BwehaaFox](https://github.com/BwehaaFox))
  * [#269](https://github.com/ember-cli/ember-template-imports/pull/269) Update treesitter links ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 3
- BwehaaFox ([@BwehaaFox](https://github.com/BwehaaFox))
- David Taylor ([@davidtaylorhq](https://github.com/davidtaylorhq))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-11-12)

ember-template-imports 4.2.0 (minor)

#### :rocket: Enhancement
* `ember-template-imports`
  * [#264](https://github.com/ember-cli/ember-template-imports/pull/264) Upgrade content-tag to v3 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 1
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## Release (2024-10-09)

ember-template-imports 4.1.3 (patch)

#### :bug: Bug Fix
* `ember-template-imports`
  * [#261](https://github.com/ember-cli/ember-template-imports/pull/261) Avoid registering babel plugin multiple times. ([@SergeAstapov](https://github.com/SergeAstapov))

#### :memo: Documentation
* `ember-template-imports`
  * [#251](https://github.com/ember-cli/ember-template-imports/pull/251) Add import path for uniqueId helper ([@simonihmig](https://github.com/simonihmig))

#### :house: Internal
* `ember-template-imports`
  * [#260](https://github.com/ember-cli/ember-template-imports/pull/260) Update .npmignore to exclude more unnecessary files ([@SergeAstapov](https://github.com/SergeAstapov))
  * [#258](https://github.com/ember-cli/ember-template-imports/pull/258) Update .npmignore to exclude unnecessary files ([@SergeAstapov](https://github.com/SergeAstapov))

#### Committers: 2
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))
- Simon Ihmig ([@simonihmig](https://github.com/simonihmig))

## Release (2024-09-24)

ember-template-imports 4.1.2 (patch)

#### :bug: Bug Fix
* `ember-template-imports`
  * [#244](https://github.com/ember-template-imports/ember-template-imports/pull/244) run babel tests in ci & rm module name ([@patricklx](https://github.com/patricklx))
  * [#241](https://github.com/ember-template-imports/ember-template-imports/pull/241) add back toc names for inspector ([@patricklx](https://github.com/patricklx))

#### :house: Internal
* `ember-template-imports`
  * [#246](https://github.com/ember-template-imports/ember-template-imports/pull/246) Add release plan ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#247](https://github.com/ember-template-imports/ember-template-imports/pull/247) Move local tooling to pnpm 9 ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#245](https://github.com/ember-template-imports/ember-template-imports/pull/245) Pin volta toolchain for local usage ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  * [#244](https://github.com/ember-template-imports/ember-template-imports/pull/244) run babel tests in ci & rm module name ([@patricklx](https://github.com/patricklx))

#### Committers: 2
- Patrick Pircher ([@patricklx](https://github.com/patricklx))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)








## v4.1.1 (2024-05-14)

#### :bug: Bug Fix
* [#236](https://github.com/ember-template-imports/ember-template-imports/pull/236) Use `this.parent` instead of `this.project` when version checking ([@Windvis](https://github.com/Windvis))
* [#234](https://github.com/ember-template-imports/ember-template-imports/pull/234) Add project description for intellisense ([@runspired](https://github.com/runspired))

#### :memo: Documentation
* [#232](https://github.com/ember-template-imports/ember-template-imports/pull/232) docs: use gjs as language for syntax highlighting ([@IgnaceMaes](https://github.com/IgnaceMaes))

#### Committers: 3
- Chris Thoburn ([@runspired](https://github.com/runspired))
- Ignace Maes ([@IgnaceMaes](https://github.com/IgnaceMaes))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))

## v4.1.0 (2024-02-05)

#### :rocket: Enhancement
* [#230](https://github.com/ember-template-imports/ember-template-imports/pull/230) Bump content-tag and add inline_source_map option ([@vstefanovic97](https://github.com/vstefanovic97))

#### :memo: Documentation
* [#231](https://github.com/ember-template-imports/ember-template-imports/pull/231) add import guide for components, helpers, modifiers  ([@Parrryy](https://github.com/Parrryy))

#### :house: Internal
* [#211](https://github.com/ember-template-imports/ember-template-imports/pull/211) Add failing test for v4 / content-tag not respecting imports, demonstrate fix by rolling for a new lockfile and cleaning up resulting peer errors ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#155](https://github.com/ember-template-imports/ember-template-imports/pull/155) Incorrectly parses some regular expressions ([@ef4](https://github.com/ef4))
* [#174](https://github.com/ember-template-imports/ember-template-imports/pull/174) add failing test for #171 ([@patricklx](https://github.com/patricklx))
* [#210](https://github.com/ember-template-imports/ember-template-imports/pull/210) Upgrade and fix lint deps ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#209](https://github.com/ember-template-imports/ember-template-imports/pull/209) Remove unused dependencies as well as template-lint ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#208](https://github.com/ember-template-imports/ember-template-imports/pull/208) upgrade test dependencies ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 6
- Chris Parry ([@Parrryy](https://github.com/Parrryy))
- Edward Faulkner ([@ef4](https://github.com/ef4))
- Ignace Maes ([@IgnaceMaes](https://github.com/IgnaceMaes))
- Patrick Pircher ([@patricklx](https://github.com/patricklx))
- Vuk ([@vstefanovic97](https://github.com/vstefanovic97))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)

## v4.0.0 (2023-10-18)

#### :boom: Breaking Change
* [#187](https://github.com/ember-template-imports/ember-template-imports/pull/187) Use content-tag, which fixes *all the bugs* ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
  Additionally,
  - for tooling authors, all exports have been removed. Use [`content-tag`](https://github.com/embroider-build/content-tag/) for your `<template>` parsing / location mapping needs.
  - for v1 addon and app users, this change fixes parsing bugs but otherwise should not be noticeable.
  - for v2 addon users, you're already using `content-tag` if you're using `addon.gjs()` from `@embroider/addon-dev`, and this change doesn't affect v2 addons.
* [#146](https://github.com/ember-template-imports/ember-template-imports/pull/146) [Cleanup] Remove all traces of hbs ([@NullVoxPopuli](https://github.com/NullVoxPopuli))  
  The only supported strict-mode syntax is now `<template>`. See https://github.com/emberjs/rfcs/pull/779
* [#138](https://github.com/ember-template-imports/ember-template-imports/pull/138) Update to support only Node 16 and 18 ([@chriskrycho](https://github.com/chriskrycho))

#### :rocket: Enhancement
* [#187](https://github.com/ember-template-imports/ember-template-imports/pull/187) Use content-tag, which fixes *all the bugs* ([@NullVoxPopuli](https://github.com/NullVoxPopuli))
* [#190](https://github.com/ember-template-imports/ember-template-imports/pull/190) Add explicit support for Ember 4.12 and 5.x ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### :bug: Bug Fix
* [#191](https://github.com/ember-template-imports/ember-template-imports/pull/191) Remove `ie 11` from browser targets in `dummy` app ([@bertdeblock](https://github.com/bertdeblock))
* [#136](https://github.com/ember-template-imports/ember-template-imports/pull/136) bump glimmer/syntax to latest ([@hmajoros](https://github.com/hmajoros))

#### :memo: Documentation
* [#179](https://github.com/ember-template-imports/ember-template-imports/pull/179) Fix(docs): add missing `extends Component` in readme example ([@StephanH90](https://github.com/StephanH90))
* [#176](https://github.com/ember-template-imports/ember-template-imports/pull/176) fix: add eslint-plugin-ember support version ([@IgnaceMaes](https://github.com/IgnaceMaes))
* [#169](https://github.com/ember-template-imports/ember-template-imports/pull/169) docs: prepare for stabilization ([@chriskrycho](https://github.com/chriskrycho))

#### :house: Internal
* [#191](https://github.com/ember-template-imports/ember-template-imports/pull/191) Remove `ie 11` from browser targets in `dummy` app ([@bertdeblock](https://github.com/bertdeblock))
* [#140](https://github.com/ember-template-imports/ember-template-imports/pull/140) Fix build against Ember v5 ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 9
- Bert De Block ([@bertdeblock](https://github.com/bertdeblock))
- Charles Fries ([@charlesfries](https://github.com/charlesfries))
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- Ewan McDougall ([@mrloop](https://github.com/mrloop))
- Hank Majoros ([@hmajoros](https://github.com/hmajoros))
- Ignace Maes ([@IgnaceMaes](https://github.com/IgnaceMaes))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)
- [@StephanH90](https://github.com/StephanH90)


## v3.4.1 (2023-01-30)

#### :bug: Bug Fix
* [#110](https://github.com/ember-template-imports/ember-template-imports/pull/110) Fix unnecessary addition of sourcemaps - Closes [#108](https://github.com/ember-template-imports/ember-template-imports/issues/108) ([@wagenet](https://github.com/wagenet))
* [#87](https://github.com/ember-template-imports/ember-template-imports/pull/87) Remove ember-cli-htmlbars from peerDependencies ([@SergeAstapov](https://github.com/sergeastapov)]

#### :memo: Documentation
* [#111](https://github.com/ember-template-imports/ember-template-imports/pull/111) Update CONTRIBUTING.md ([@wagenet](https://github.com/wagenet))

#### Committers: 2
- Peter Wagenet ([@wagenet](https://github.com/wagenet))
- Sergey Astapov ([@SergeAstapov](https://github.com/SergeAstapov))

## v3.4.0 (2022-11-09)

#### :rocket: Enhancement
* [#83](https://github.com/ember-template-imports/ember-template-imports/pull/83) feat: adds tagName to TemplateTag ([@gabrielcsapo](https://github.com/gabrielcsapo))
* [#82](https://github.com/ember-template-imports/ember-template-imports/pull/82) feat: adds default exports to avoid importing from nested paths ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :memo: Documentation
* [#80](https://github.com/ember-template-imports/ember-template-imports/pull/80) readme: update example neovim link ([@NullVoxPopuli](https://github.com/NullVoxPopuli))

#### Committers: 2
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))
- [@NullVoxPopuli](https://github.com/NullVoxPopuli)


## v3.3.1 (2022-10-26)

#### :bug: Bug Fix
* [#78](https://github.com/ember-template-imports/ember-template-imports/pull/78) Bring back `src/utils.js` temporarily ([@rwjblue](https://github.com/rwjblue))

#### Committers: 1
- Robert Jackson ([@rwjblue](https://github.com/rwjblue))


## v3.3.0 (2022-10-26)

#### :house: Internal
* [#75](https://github.com/ember-template-imports/ember-template-imports/pull/75) chore: converts util to typescript ([@gabrielcsapo](https://github.com/gabrielcsapo))
* [#77](https://github.com/ember-template-imports/ember-template-imports/pull/77) feat: move over utils from ember-template-lint ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### Committers: 1
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))


## v3.2.0 (2022-10-25)

#### :rocket: Enhancement
* [#74](https://github.com/ember-template-imports/ember-template-imports/pull/74) Provide the contents of the parsed template when calling `parseTemplates` ([@gabrielcsapo](https://github.com/gabrielcsapo))
* [#73](https://github.com/ember-template-imports/ember-template-imports/pull/73) Do not require parent addon to include ember-cli-htmlbars ([@gabrielcsapo](https://github.com/gabrielcsapo))

#### :house: Internal
* [#56](https://github.com/ember-template-imports/ember-template-imports/pull/56) internal: set up Dependabot ([@chriskrycho](https://github.com/chriskrycho))

#### Committers: 2
- Chris Krycho ([@chriskrycho](https://github.com/chriskrycho))
- Gabriel Csapo ([@gabrielcsapo](https://github.com/gabrielcsapo))


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
