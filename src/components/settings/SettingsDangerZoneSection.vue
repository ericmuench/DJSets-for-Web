<template>
  <div class="danger-zone p-2 shadow-sm">
    <h2 class="h2 bold-font mb-4">Danger-Zone</h2>
    <h4 class="bold-font">Daten löschen</h4>
    <p class="break-word">
      Mit dieser Einstellung können alle Daten von DJSets (Setlisten und Songs) gelöscht werden. Dies ist z.B. hilfreich bei einem gewünschten Reset.
      Stelle unbedingt sicher, dass du wirklich alle Daten löschen möchtest. Sie können nicht wiederhergestellt werden.
      Wenn du deine Daten nur temporär zurücksetzen möchtest kannst du sie vor dem Löschen exportieren und anschießend wieder importieren.
    </p>
    <button @click="onDeleteAllData" class="btn btn-danger">Alle Daten löschen</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SettingsDangerZoneSection',
  methods: {
    ...mapActions(['clearSongs', 'clearSetlists']),
    onDeleteAllData () {
      const deletePermission = confirm('ACHTUNG: Die gelöschten Daten können NICHT wiederhergestellt werden. Sollen sie wirklich gelöscht werden?')
      if (deletePermission) {
        this.clearSongs()
        this.clearSetlists()
      }
    }
  }
}
</script>

<style scoped>
.danger-zone{
  border: 0.2em solid var(--colorAccentHover);
  border-radius: 8px;
}
p{
  word-wrap: break-word;
  word-break: normal;
}
</style>
