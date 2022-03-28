<template>
    <router-link :to="destination" class="router-link">
      <div :class="[isActive ? 'bckgrnd-accent-hoverable' : 'bckgrnd-darkgray-hoverable','nav-item text-light']">
        <img class="nav-item-img" :src="icUrl"/>
        <p class="nav-item-text">{{caption}}</p>
      </div>
    </router-link>
</template>
<script>
export default {
  name: 'NavItem',
  props: {
    icName: String,
    caption: {
      type: String,
      required: true
    },
    destination: {
      type: Object,
      required: true
    }
  },
  computed: {
    icUrl () {
      try {
        return require(`../../assets/icons/${this.icName}`)
      } catch (err) {
        console.error(err)
        return ''
      }
    },
    isActive () {
      return this.$router.currentRoute.value.fullPath.includes(this.destination.name)
    }
  }
}
</script>

<style scoped>
.nav-item{
    display: flex;
    padding: 1.5em;
}

.nav-item-text{
    font-size: 1.5em;
    margin: auto 1em auto 1em;
}

@media only screen and (max-width: 1000px) {
  .nav-item {
    padding: 0.5em;
    flex-direction: column;
  }

  .nav-item-text{
    font-size: 1em;
    margin: 0.5em auto 0 auto;
  }

  .nav-item-img{
    margin: auto;
  }
}

.router-link{
  text-decoration: none;
}
</style>
