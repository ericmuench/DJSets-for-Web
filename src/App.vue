<template>
  <router-view></router-view>
  <!--:key="$route.path"-->
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions(['restoreDataFromWebStorage'])
  },
  created () {
    this.restoreDataFromWebStorage()
  }
}
</script>
