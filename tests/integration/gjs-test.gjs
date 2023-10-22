import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { precompileTemplate } from '@ember/template-compilation';
import Component from '@glimmer/component';

import GjsTest from 'dummy/components/gjs-test';

module('tests/integration/components/gjs', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const Foo = <template>Hello, {{@name}}!</template>

    await render(
      precompileTemplate(`<Foo @name="world" />`, {
        strictMode: true,
        scope: () => ({ Foo }),
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });

  test('it works with classes', async function (assert) {
    class Foo extends Component {
      greeting = 'Hello';

      <template>{{this.greeting}}, {{@name}}!</template>
    }

    await render(
      precompileTemplate(`<Foo @name="world" />`, {
        strictMode: true,
        scope: () => ({ Foo }),
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });

  test('it works with classes with a backtick character somewhere in the template', async function (assert) {
    class Foo extends Component {
      greeting = 'Hello';

      <template>{{this.greeting}}, `lifeform`!</template>
    }

    await render(
      precompileTemplate(`<Foo />`, {
        strictMode: true,
        scope: () => ({ Foo }),
      })
    );
    assert.equal(this.element.textContent.trim(), 'Hello, `lifeform`!');
  });

  test('it works with classes with a missing semi in class attributes', async function (assert) {
    class Foo extends Component {
      greeting = 'Hello'

      <template>{{this.greeting}}, `lifeform`!</template>
    }

    await render(
      precompileTemplate(`<Foo />`, {
        strictMode: true,
        scope: () => ({ Foo }),
      })
    );
    assert.equal(this.element.textContent.trim(), 'Hello, `lifeform`!');
  });

  test('it works with classes with a slash character somewhere before the template', async function (assert) {
    class Foo extends Component {
      greeting = 'Hello';
      get age() {
        return 90 / 2;
      }

      <template>{{this.greeting}}, {{this.age}}-year-old!</template>
    }

    await render(
      precompileTemplate(`<Foo @name="world" />`, {
        strictMode: true,
        scope: () => ({ Foo }),
      })
    );
    assert.equal(this.element.textContent.trim(), 'Hello, 45-year-old!');
  });

  test('it works with a component that is a top-level default export', async function (assert) {
    await render(
      precompileTemplate(`<GjsTest />`, {
        strictMode: true,
        scope: () => ({ GjsTest }),
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });

  test('it is not confused by a template-tag-like regex', async function (assert) {
    let pattern = /<template\s*>/;
    assert.ok(pattern);
  });
});
