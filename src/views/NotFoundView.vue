<template>
  <div class="p-3 text-light bckgrnd-mediumgray min-vh-100 d-flex flex-column justify-content-center align-items-center">
    <h1>Ups...</h1>
    <h2>Offenbar konnte nichts gefunden werden :(</h2>
    <p class="font-secondary m-1">Bitte überprüfe die URL und versuche es erneut</p>
    <h4 class="font-secondary m-4">Oder</h4>
    <router-link :to="{ name: 'main'}">
      <button class="btn btn-success">Gehe zurück zum Hauptmenü</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style>

</style>
