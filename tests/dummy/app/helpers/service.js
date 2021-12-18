import { getOwner } from '@ember/application';
import Helper from '@ember/component/helper';

export default class GetService extends Helper {
  compute([name]) {
    return getOwner(this).lookup(`service:${name}`);
  }
}
