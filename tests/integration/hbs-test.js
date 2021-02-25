import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { precompileTemplate } from '@ember/template-compilation';
import Component from '@glimmer/component';

import { hbs } from 'ember-template-imports';
// eslint-disable-next-line ember/no-test-import-export
import HbsTest from 'dummy/components/hbs-test';

module('tests/integration/components/hbs', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const Foo = hbs`Hello, {{@name}}!`;

    await render(
      precompileTemplate(`<Foo @name="world" />`, {
        strictMode: true,
        scope: { Foo },
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });

  test('it works with classes', async function (assert) {
    class Foo extends Component {
      greeting = 'Hello';

      static template = hbs`{{this.greeting}}, {{@name}}!`;
    }

    await render(
      precompileTemplate(`<Foo @name="world" />`, {
        strictMode: true,
        scope: { Foo },
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });

  test('it works with a component that is a top-level default export', async function (assert) {
    await render(
      precompileTemplate(`<HbsTest />`, {
        strictMode: true,
        scope: { HbsTest },
      })
    );

    assert.equal(this.element.textContent.trim(), 'Hello, world!');
  });
});
