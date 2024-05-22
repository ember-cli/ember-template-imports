import Component from '@glimmer/component';

export const TemplateOnly = <template>

  Template only!

</template>;

export class Classy extends Component {
  greeting = 'hello there';

  <template>
    {{this.greeting}}
    <TemplateOnly />
  </template>
}

export default Classy;
