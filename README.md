# ember-template-imports

## aka First-Class Component Templates

This addon began as a testing ground for various "template import" syntaxes,
but has essentially evolved to implement the
[First-Class Component Templates RFC](https://rfcs.emberjs.com/id/0779-first-class-component-templates/),
which introduces `<template>` tags as a format for making component templates
first-class participants in JavaScript and TypeScript with
[strict mode](https://rfcs.emberjs.com/id/0496-handlebars-strict-mode/)
template semantics. The `<template>` syntax is made available to
JavaScript and TypeScript files with the `.gjs` and `.gts` extensions, respectively.

First-class component templates address a number of pain points in today’s component
authoring world, and provide a number of new capabilities to Ember and Glimmer users:

- accessing local JavaScript values with no ceremony and no backing class, enabling much
  easier use of existing JavaScript ecosystem tools, including especially styling
  libraries—standard [CSS Modules](https://github.com/css-modules/css-modules)
  will “just work,” for example
- authoring more than one component in a single file, where colocation makes sense—and
  thereby providing more control over a component’s public API
- likewise authoring locally-scoped helpers, modifiers, and other JavaScript functionality

Here is an example of a `.gjs` / `.gts` component file, which demonstrates how other
components (e.g. `MyComponent`) can be imported using JS/TS `import` syntax, and then
rendered within the embedded `<template>` tag:

```js
import MyComponent from './my-component';

<template>
  <p>
    Rendering MyComponent below:
  </p>
  <MyComponent/>
</template>
```

## Using Template Tags and `.gjs` Files

Template tags are a new syntax introduced in `.gjs`, a new file format that is
a superset of standard JavaScript. In this syntax, templates are defined in
JavaScript files directly.

```js
// components/hello.gjs
<template>
  <span>Hello, {{@name}}!</span>
</template>
```

This example defines a template-only component, which is the default export of
`hello.js`. You would be able to use this component in another component
like so:

```js
// components/hello-world.gjs
import Hello from './hello';

<template>
  <Hello @name="world" />
</template>
```

You can also export the component explicitly:

```js
// components/hello.gjs
export default <template>
  <span>Hello, {{@name}}!</span>
</template>
```

Omitting the `export default` is just syntactic sugar. In addition, you can
define template-only components and assign them to variables, allowing you to
export components with named exports:

```js
export const First = <template>First</template>

export const Second = <template>Second</template>

export const Third = <template>Third</template>
```

This also allows you to create components that are only used locally, in the
same file:

```js
const Option = <template>
  <option selected={{@selected}} value={{@value}}>
    {{or @title @value}}
  </option>
</template>

export const CustomSelect = <template>
  <select>
    {{#each @options as |option|}}
      <Option
        @value={{option.value}}
        @selected={{eq option @selectedOption}}
      />
    {{/each}}
  </select>
</template>
```

Helpers and modifiers can also be defined in the same file as your components,
making them very flexible:

```js
import { helper } from '@ember/component/helper';
import { modifier } from 'ember-modifier';

const plusOne = helper(([num]) => num + 1);

const setScrollPosition = modifier((element, [position]) => {
  element.scrollTop = position
});

<template>
  <div class="scroll-container" {{setScrollPosition @scrollPos}}>
    {{#each @items as |item index|}}
      Item #{{plusOne index}}: {{item}}
    {{/each}}
  </div>
</template>
```

Finally, to associate a template with a class-based component, you can use the
template syntax directly in the class body:

```js
// components/hello.gjs
export default class Hello {
  name = 'world';

  <template>
    <span>Hello, {{this.name}}!</span>
  </template>
}
```

## Reference: built-in helpers, modifiers, components

As implemented as part of the [Strict Mode Templates RFC][rfc-496], the built in
helpers, modifiers and components are available for import:

* `array` (`import { array } from '@ember/helper';`)
* `concat` (`import { concat } from '@ember/helper';`)
* `fn` (`import { fn } from '@ember/helper';`)
* `get` (`import { get } from '@ember/helper';`)
* `hash` (`import { hash } from '@ember/helper';`)
* `on` (`import { on } from '@ember/modifier';`)
* `Input` (`import { Input } from '@ember/component';`)
* `LinkTo` (`import { LinkTo } from '@ember/routing';`)
* `TextArea` (`import { TextArea } from '@ember/component';`)

[rfc-496]: https://github.com/emberjs/rfcs/pull/496

## Compatibility

* Ember.js v3.27 or above
* Ember CLI v2.13 or above
* `ember-cli-htmlbars` 6.0 or above
* Node.js v12 or above

## Status / Stability

There some remaining issues regarding Prettier, ESLint, and ember-template-lint support;
please see [this issue](https://github.com/ember-template-imports/ember-template-imports/issues/35)
for more information.

## Installation

```
ember install ember-template-imports
```

## Editor Integrations

To get syntax highlighting inside embedded templates and support for the GJS
file extension, you may need to configure your editor.

### Visual Studio Code
The [vscode-glimmer](https://marketplace.visualstudio.com/items?itemName=chiragpat.vscode-glimmer) plugin handles syntax highlighting for `.gjs` and `.gts` files.

### Neovim

[Example Neovim Config](https://github.com/NullVoxPopuli/dotfiles/blob/master/home/.config/nvim/lua/plugins.lua#L69) with support for good highlighting of embedded templates in JS and TS, using:

- https://github.com/nvim-treesitter/nvim-treesitter
- https://github.com/alexlafroscia/tree-sitter-glimmer



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
