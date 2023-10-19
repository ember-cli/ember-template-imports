import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';

class WithModifier extends Component {
  click = () => {};

  <template>
    <button type="button" {{on 'click' this.click}}>Click me</button>
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
});
