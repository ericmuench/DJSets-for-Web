<template>
    <header
        class="mobile-appbar text-light shadow-sm bckgrnd-darkgray bold-font">
        <p>{{title}}</p>
    </header>
</template>
<script>
export default {
  name: 'MobileAppbar',
  props: {
    title: String
  }
}
</script>

<style scoped>
.mobile-appbar{
    font-size: 1.5em;
    width: 100vw;
    z-index: 1;
    position: fixed;
}

p{
    margin: 0.75em;
}
</style>
