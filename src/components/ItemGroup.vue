<template>
  <div>
    <h3 class="bold-font mx-1 mt-2">{{title}}</h3>
    <Divider thickness="1px"/>
    <div :class="itemsContainerClass" v-for="(item, index) of items" :key="index">
      <slot name="item" :item="item"></slot>
    </div>
  </div>
</template>

<script>
import Divider from '../components/customviews/Divider'

export default {
  name: 'ItemGroup',
  components: {
    Divider
  },
  props: {
    title: String,
    items: {
      type: Array,
      default: () => []
    },
    itemsContainerClass: {
      type: String,
      default: ''
    }
  }
}
</script>
