<template>
  <div class="my-4" :style="{height: thickness}" ></div>
</template>
<script>
export default {
  name: 'Divider',
  props: {
    thickness: String
  }
}
</script>

<style scoped>
  div{
    background: var(--colorBackgroundLightGray);
    opacity: 0.5;
  }
</style>
