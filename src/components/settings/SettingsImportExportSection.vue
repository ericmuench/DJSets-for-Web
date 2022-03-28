<template>
  <div>
    <h2 class="h2 bold-font mb-4">Import & Export</h2>
    <h4 class="bold-font">Daten-Export</h4>
    <p class="font-secondary">Sichere deine Songs und Setlisten in Form einer Datei auf deinem Computer!</p>
    <label class="h5 form-label bold-font needs-validation" for="settings-menu-view-input-exportfilename">Titel der Datendatei</label>
    <div class="d-flex align-items-end mb-2">
      <input
          :class="[isValidExportFileName ? 'is-valid' : 'is-invalid', 'text-light p-2 form-control shadow-sm']"
          id="settings-menu-view-input-exportfilename"
          placeholder="Bitte den Namen der Exportdatei angeben"
          v-model="exportFilename"/>
      <span class="h6 mx-2 unbreakable-word">.json</span>
    </div>
    <DownloadTrigger
      :dataType="'data:application/json;charset=utf-8'"
      :fileContent="applicationDataAsJson"
      :fileName="`${exportFilename}.json`">
      <button :disabled="!isValidExportFileName" class="btn-success btn mb-4">Daten exportieren</button>
    </DownloadTrigger>
    <h4 class="bold-font">Daten-Import</h4>
    <p class="font-secondary">Importiere eine Daten-Datei von deinem Computer und vereinige sie mit den aktuellen Songs und Setlisten.
        Diese Funktion kann genutzt werden, um einen bereits exportierten Datenstand wiederherzustellen oder mit dem aktuellen Datenstand zu vereinigen.
    </p>
    <button
        class="btn-success btn mb-4"
        data-bs-toggle="modal"
        data-bs-target="#modal-settings-data-import">
        Daten importieren
    </button>
    <FileImportModal
        title="Daten importieren"
        :mainActions="importActions"
        :fileInputParser="onParseImportFileData"
        @filedatachanged="onImportFileDataChanged"
        acceptedTypes="application/json"
        modalToggleId="modal-settings-data-import">
        <template v-slot:fileData>
          <div v-if="importFileData !== null">
            <div class="my-4" v-if="importFileData.setlists !== undefined">
              <h3>Setlisten:</h3>
              <p class="font-secondary" v-show="importFileData.setlists.length == 0">Keine Setlisten vorhanden...</p>
              <SimpleItem
                class="my-2"
                v-for="setlist in importFileData.setlists"
                :key="setlist.id"
                :title="setlist.setlistInfo.title"
                :subtitle="`${setlist.setlistInfo.description.substr(0, 50)}...`"/>
            </div>
            <div v-if="importFileData.songs !== undefined">
              <h3>Songs:</h3>
              <p class="font-secondary" v-show="importFileData.songs.length == 0">Keine Songs vorhanden...</p>
              <div class="d-inline-flex flex-wrap">
                <SimpleItem
                  class="me-2 my-1"
                  v-for="song in importFileData.songs.sort(alphabeticalSongTitleCompare)"
                  :key="song.id"
                  :title="song.songInfo.title"
                  :subtitle="song.songInfo.artist"/>
              </div>
            </div>
          </div>
        </template>
    </FileImportModal>
  </div>
</template>

<script>
import DownloadTrigger from '../customviews/DownloadTrigger'
import FileImportModal from '../customviews/FileImportModal'
import SimpleItem from '../customviews/SimpleItem'

import { isValidFileName } from '../../businesslogic/util/Validators'
import { createSongsFromRawJSON, createSetlistsFromRawJSON } from '../../businesslogic/util/DataJSONParsing'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SettingsImportExportSection',
  components: {
    DownloadTrigger,
    FileImportModal,
    SimpleItem
  },
  data () {
    return {
      exportFilename: 'DJSetsData',
      importActions: [
        { onClick: () => { this.onImportData(this.integrateExternalDataByOverride, 'Achtung: Alle bisherigen Daten werden überschrieben. Soll der Import wirklich durchgeführt werden?') }, title: 'Existierende Daten überschreiben' },
        { onClick: () => { this.onImportData(this.mergeExternalDataByIdReassign, 'Soll der Import wirklich durchgeführt werden?') }, title: 'In existierende Daten integrieren (Vorhandene Elemente beibehalten)' },
        { onClick: () => { this.onImportData(this.mergeExternalDataByUpdateExistingElements, 'Soll der Import wirklich durchgeführt werden?') }, title: 'In existierende Daten integrieren (Vorhandene Elemente aktualisieren)' }
      ],
      importFileData: null
    }
  },
  methods: {
    ...mapActions(['integrateExternalDataByOverride', 'mergeExternalDataByUpdateExistingElements', 'mergeExternalDataByIdReassign']),
    onParseImportFileData (fileContent) {
      try {
        const rawContent = JSON.parse(fileContent)
        return { setlists: createSetlistsFromRawJSON(rawContent.setlists, []), songs: createSongsFromRawJSON(rawContent.songs, []) }
      } catch (err) {
        console.warn(err)
        alert('Es ist ein Fehler beim Importieren der Datei aufgetreten. Bitte versuche es mit einer anderen Datei erneut und stelle sicher,, dass es sich um eine valide JSON-datei handelt!')
        return null
      }
    },
    onImportFileDataChanged (fileData) {
      this.importFileData = fileData
    },
    onImportData (integrationFunction, warningMsg) {
      const importPermission = confirm(warningMsg)
      if (importPermission && this.importFileData !== null) {
        integrationFunction({ songs: this.importFileData.songs, setlists: this.importFileData.setlists })
      }
    },
    alphabeticalSongTitleCompare (song1, song2) {
      const title1 = song1.songInfo.title.toLowerCase()
      const title2 = song2.songInfo.title.toLowerCase()
      if (title1 < title2) {
        return -1
      } else if (title1 > title2) {
        return 1
      } else {
        return 0
      }
    }
  },
  computed: {
    ...mapGetters(['applicationDataAsJson']),
    isValidExportFileName () {
      return isValidFileName(this.exportFilename)
    }
  }
}
</script>

<style scoped>
.unbreakable-word{
  word-break: keep-all;
}
p{
  word-wrap: break-word;
  word-break: normal;
}
</style>
