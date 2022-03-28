<template>
  <div class="py-2 px-3 shadow-sm rounded bckgrnd-darkgray-hoverable">
    <h4 class="bold-font">{{title}}</h4>
    <h6 class="lighter-font">{{subtitle}}</h6>
  </div>
</template>

<script>
export default {
  name: 'SimpleItem',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    subtitle: {
      type: String,
      default: 'Subtitle'
    }
  }
}
</script>

<style>
div{
  word-break: break-all;
}
</style>
