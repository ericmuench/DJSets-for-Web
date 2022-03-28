<template>
  <div class="min-vh-100">
        <MobileAppbar title="DJSets" v-once/>
        <MainNavigation id="main-nav"/>
        <main class="bckgrnd-mediumgray text-secondary">
            <router-view></router-view>
            <!--add this, if there are UI Update issues: :key='$route.path'-->
        </main>
    </div>
</template>

<script>
import MainNavigation from '../components/MainNavigation'
import MobileAppbar from '../components/customviews/MobileAppbar'

export default {
  name: 'MainMenuView',
  components: {
    MainNavigation,
    MobileAppbar
  }
}
</script>

<style scoped>
#main-nav{
  width: var(--main-nav-width);
  height : var(--main-nav-height);
}

main{
  padding-top: var(--main-area-top-padding);
  padding-left: var(--main-area-left-padding);
  padding-bottom: var(--main-area-bottom-padding);
}
</style>
