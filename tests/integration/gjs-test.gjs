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

  test('it works with a component that is a top-level default export', async function (assert) {
    await render(
      precompileTemplate(`<GjsTest />`, {
        strictMode: true,
        scope: () => ({ GjsTest }),
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });
});
