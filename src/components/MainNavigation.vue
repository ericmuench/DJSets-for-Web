<template>
    <nav
        class="position-fixed shadow-sm bckgrnd-darkgray text-light">
        <h1 class="nav-logo">DJ-Sets</h1>
        <NavItem :destination="{ name: 'setlists'}" icName="ICSetlist.svg" class="navigation-item" caption="Setlisten"/>
        <NavItem :destination="{ name: 'songs'}" icName="ICSong.svg" class="navigation-item" caption="Songs"/>
        <NavItem :destination="{ name: 'settings'}" icName="ICSettings.svg" class="navigation-item" caption="Einstellungen"/>
    </nav>
</template>
<script>
import NavItem from './customviews/NavItem.vue'
export default {
  name: 'MainNavigation',
  components: { NavItem }
}
</script>

<style scoped>
nav{
  bottom:0;
  z-index: 1;
}

@media only screen and (min-width: 1000px){
    nav{
      display: flex;
      flex-direction: column;
      top: 0;
    }

    .nav-logo{
      text-align: center;
      padding: 1em 0 1em 0;
      font-weight: bold;
    }
}

@media only screen and (max-width: 1000px) {
  nav{
    display: flex;
    justify-content: center;
    flex-direction: row;
    left: 0;
    right: 0;
  }

  .navigation-item{
    flex-grow: 1;
  }

  .nav-logo{
    visibility: collapse;
    padding: 0;
    height: 0px;
    width: 0px;
  }
}
</style>
