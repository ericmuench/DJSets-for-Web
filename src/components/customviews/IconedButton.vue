<template>
  <button class="btn">
    <img class="m-0 p-0"
         :style="{width: icSize + 'px'}"
         :src="imgUrl" />
    <p :class="[shouldDisplayDescription ? 'mt-2'  : '','p-0 mx-0 mb-0 text-light h4']"
       :style='[shouldDisplayDescription ? "" : "height: 0; visibility: hidden;"]'
       >{{description}}</p>
  </button>
</template>

<script>
export default {
  name: 'IconedButton',
  props: {
    icName: String,
    description: String,
    icSize: {
      type: Number,
      default: 100
    },
    shouldDisplayDescription: Boolean
  },
  computed: {
    imgUrl () {
      try {
        return require(`../../assets/icons/${this.icName}`)
      } catch (error) {
        return ''
      }
    }
  }
}
</script>
<style scoped>
button{
  background-color: transparent;
}

button:hover{
  background-color: var(--colorBackgroundLightGray);
}
</style>
