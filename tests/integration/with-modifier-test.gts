import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import {JustAPlainClass} from 'dummy/utils/just-a-plain-class';
import { WithModifier } from 'dummy/components/with-modifier';

class WithHelper extends Component {
  trueCondition = 'true';

  <template>
    {{#if (eq this.trueCondition 'true')}}
      <div>TRUE</div>
    {{/if}}
  </template>
}

class WithAnotherClass extends Component {
  plainClass = new JustAPlainClass();

  <template>
    <div>{{this.plainClass.someState}}</div>
  </template>
}


module('tests/integration/components/gjs', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a component with a modifier', async function (assert) {
    await render(
      <template>
        <WithModifier />
      </template>
    );
    assert.equal(this.element.textContent.trim(), 'Click me');
  })

  test('it renders a component with a modifer with precompileTemplate', async function (assert) {
    await render(precompileTemplate(`<WithModifier />`, {
      strictMode: true,
      scope: () => ({WithModifier, on})
    }));
    assert.equal(this.element.textContent.trim(), 'Click me');
  })

  test('it renders a component with a helper', async function (assert) {
    await render(
      <template>
        <WithHelper />
      </template>
    );
    assert.equal(this.element.textContent.trim(), 'TRUE');
  })

  test('it renders a component that consumes another class', async function (assert) {
    await render(
      <template>
        <WithAnotherClass />
      </template>
    );
    assert.equal(this.element.textContent.trim(), 'someState');
  })
});
