import { hbs } from 'ember-template-imports';
import Component from '@glimmer/component';

// eslint-disable-next-line no-unused-vars
const First = hbs`Hello`;

// eslint-disable-next-line no-unused-vars
class Second extends Component {
  static template = hbs`world`;
}

// eslint-disable-next-line ember/no-test-import-export
export default hbs`<First/>, <Second/>!`;
