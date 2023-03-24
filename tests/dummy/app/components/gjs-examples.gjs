import Component from '@glimmer/component';

const divide = () => 4 / 2;

const First = <template>Hello</template>

class Second extends Component {
  <template>world</template>
}

<template>
  <First/>, <Second/>!
  {{(divide)}}
</template>
