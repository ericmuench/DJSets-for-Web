<template>
  <div class="p-3 text-light bckgrnd-mediumgray min-vh-100">
    <div class="d-flex">
      <IconedButton
        @click="onGoBack"
        class="col-auto"
        icName='ICBack.svg'
        :icSize='20'/>
      <div class="px-2 d-flex flex-wrap flex-grow-1">
        <div class="d-inline-flex flex-grow-1">
          <h1 class="h1 col m-auto">{{setlist.setlistInfo.title}}</h1>
        </div>
        <div class="d-flex flex-wrap">
          <p class="h5 my-auto break-word">Gesamtlänge: {{getSetlistDurationString(setlist)}}</p>
          <div>
            <IconedButton
              class="col"
              icName='ICDelete.svg'
              @click="onDelete"
              :icSize='20'/>
            <IconedButton
              class="col"
              data-bs-toggle="modal"
              data-bs-target="#edit-setlist-title-description"
              icName='ICEdit_Dark.svg'
              :icSize='20'/>
            <TitleDescriptionView
              modalTitle="Setliste bearbeiten"
              :initTitle="setlist.setlistInfo.title"
              :initDescription="setlist.setlistInfo.description"
              :shouldResetWhenOpened="true"
              @mainaction="onEditSetlistTitleDescription"
              modalToggleId="edit-setlist-title-description"/>
            <DownloadTrigger
              :dataType="'data:text/plain;charset=utf-8'"
              :fileContent="shareableSetlist"
              :fileName="`${setlist.setlistInfo.title}.txt`">
                <IconedButton
                  class="col"
                  icName='ICDownload.svg'
                  :icSize='20'/>
            </DownloadTrigger>
          </div>
      </div>
    </div>
    </div>
    <section class="row p-3 font-secondary">{{setlist.setlistInfo.description}}</section>
    <section v-show="noSongsAvailable" class="h3 font-secondary text-center">Hier sieht es recht leer aus. Füge einen Song über den Hinzufügen-Button ein ;)</section>
    <SongDetailItem
      v-for="(song, index) in allSongs" :key="index"
      :displayIndex="index + 1"
      :title="song.songInfo.title"
      :artist="song.songInfo.artist"
      :tempo="song.songInfo.tempo"
      :genre="song.songInfo.genre"
      :musicscaleRepresentation="song.songInfo.musicscale.getMajorMinorRepresentation()"
      :durationString="timeFormatConverter.convertToDurationString(song.songInfo.duration)"
      @dismiss="onDeleteSongFromSetlist(index)"
      draggable="true"
      @dragover.prevent
      @dragstart="onDragSongForMove($event, index)"
      @drop="onDropMovedSong($event, index)"/>
    <DropDownButton
      :items="addOptions"
      buttonStyle="bckgrnd-lightgray-hoverable"
      title="Song hinzufügen"
      class="mx-1 my-4">
      <template v-slot:item="{ item }">
        <div v-if="item.purpose.title == uiPurposeTitles.ADD_NEW ">
          <div
            data-bs-toggle="modal"
            data-bs-target="#add-new-song-to-setlist-modal">{{item.title}}</div>
        </div>
        <div v-else-if="item.purpose.title == uiPurposeTitles.ADD_EXISTING">
          <div
            data-bs-toggle="modal"
            data-bs-target="#add-existing-song-to-setlist-modal">{{item.title}}</div>
        </div>
      </template>
    </DropDownButton>
    <SongDetailView :purpose="addNewPurpose" title="Song erstellen und zur Setliste hinzufügen" modalToggleId="add-new-song-to-setlist-modal"/>
    <SongChooseView
      title='Existierende Songs hinzufügen'
      modalToggleId="add-existing-song-to-setlist-modal"
      @songschoose="onAddExistingSongs"/>
  </div>
</template>

<script>
import IconedButton from '../components/customviews/IconedButton'
import DropDownButton from '../components/customviews/DropDownButton'
import SongDetailItem from '../components/SongDetailItem'
import TitleDescriptionView from './TitleDescriptionView'
import { UIPurpose, UIPurposeTitles } from '../businesslogic/util/UIPurpose'
import SongDetailView from './SongDetailView.vue'
import SongChooseView from './SongChooseView'
import DownloadTrigger from '../components/customviews/DownloadTrigger'

import { undefinedSetlist } from '../businesslogic/model/Setlists'
import { mapGetters, mapActions } from 'vuex'
import { TimeFormatConverter } from '../businesslogic/util/TimeFormatConverter'
import { isPositiveIntegerNumber } from '../businesslogic/util/Validators'

export default {
  name: 'SetlistDetailView',
  components: {
    IconedButton,
    SongDetailItem,
    TitleDescriptionView,
    DropDownButton,
    SongDetailView,
    SongChooseView,
    DownloadTrigger
  },
  data () {
    return {
      setlistId: this.$route.params.setlistId,
      timeFormatConverter: new TimeFormatConverter(),
      uiPurposeTitles: UIPurposeTitles,
      dragDropDataTransferKeys: {
        originIndexKey: 'originIndex'
      }
    }
  },
  methods: {
    ...mapActions(['deleteSetlist', 'updateSetlistTitleDescription', 'deleteSongFromSetlistIndexed', 'addSongsToSetlist', 'moveSongInSetlist']),
    onDelete () {
      const deletePermission = confirm(`Soll die Setliste "${this.setlist.setlistInfo.title}" wirklich gelöscht werden?`)
      if (deletePermission) {
        this.onGoBack()
        this.deleteSetlist(this.setlist)
      }
    },
    onEditSetlistTitleDescription (newTitle, newDescription) {
      this.updateSetlistTitleDescription({ setlist: this.setlist, title: newTitle, description: newDescription })
    },
    onDeleteSongFromSetlist (index) {
      this.deleteSongFromSetlistIndexed({ setlist: this.setlist, index: index })
    },
    onAddExistingSongs (selectedSongs) {
      this.addSongsToSetlist({ songs: selectedSongs, setlist: this.setlist })
    },
    onDropMovedSong (ev, destinationIndex) {
      const originIndexStr = ev.dataTransfer.getData(this.dragDropDataTransferKeys.originIndexKey)
      if (!isPositiveIntegerNumber(originIndexStr)) {
        return
      }
      const originIndex = parseInt(originIndexStr)

      if (originIndex < 0 || originIndex >= this.setlist.setlistInfo.songIds.length) {
        return
      }
      this.moveSongInSetlist({ setlist: this.setlist, fromIndex: originIndex, toIndex: destinationIndex })
    },
    onDragSongForMove (ev, originIndex) {
      ev.dataTransfer.setData(this.dragDropDataTransferKeys.originIndexKey, originIndex)
    },
    onGoBack () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapGetters(['getSetlistById', 'getAllSongsOfSetlist', 'getSetlistDurationString', 'setlistAsShareable']),
    addNewPurpose () {
      return new UIPurpose(UIPurposeTitles.ADD_NEW, { setlist: this.setlist })
    },
    addExistingPurpose () {
      return new UIPurpose(UIPurposeTitles.ADD_EXISTING, { setlist: this.setlist })
    },
    setlist () {
      const setlist = this.getSetlistById(this.setlistId)
      if (setlist === undefined) {
        return undefinedSetlist
      }

      return setlist
    },
    allSongs () {
      return this.getAllSongsOfSetlist(this.setlist)
    },
    addOptions () {
      return [
        { purpose: this.addNewPurpose, title: 'Neuen Song erstellen und hinzufügen' },
        { purpose: this.addExistingPurpose, title: 'Bestehende Songs hinzufügen' }
      ]
    },
    shareableSetlist () {
      return this.setlistAsShareable(this.setlist)
    },
    noSongsAvailable () {
      return this.setlist.setlistInfo.songIds.length === 0
    }
  }
}
</script>
