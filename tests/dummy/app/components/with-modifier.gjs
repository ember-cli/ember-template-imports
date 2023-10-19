import { on } from '@ember/modifier';
import Component from '@glimmer/component';

export class WithModifier extends Component {
  click = () => {};

  <template>
    <button type="button" {{on 'click' this.click}}>Click me</button>
  </template>
}

