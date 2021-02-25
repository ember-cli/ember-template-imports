import Component from '@glimmer/component';

const First = <template>Hello</template>

class Second extends Component {
  <template>world</template>
}

<template>
  <First/>, <Second/>!
</template>
