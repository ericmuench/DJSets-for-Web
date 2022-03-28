<template>
  <div class="bckgrnd-mediumgray text-light p-3 min-vh-100">
    <IconedButton
        icName="ICPlus.svg"
        description="Song hinzufügen"
        :shouldDisplayDescription="true"
        data-bs-toggle="modal"
        data-bs-target="#new-song-modal"/>
    <SongDetailView
      :purpose="createPurpose"
      title="Neuen Song hinzufügen"
      modalToggleId="new-song-modal"/>
    <Divider thickness="2px"/>
    <div class="p-2">
      <h3 class="p-1 bold-font">Meine Songs</h3>
      <input
          type="text"
          v-model="searchQuery"
          autocomplete="off"
          placeholder="Nach Song oder Interpret suchen..."
          class="form-control text-light p-2"/>
    </div>
    <section v-show="noSongsAvailable" class="h3 font-secondary text-center mt-4">Hier sieht es recht leer aus. Füge einen Song über den Hinzufügen-Button ein ;)</section>
    <div class="px-2 pt-4">
      <div v-for="(songGroup,key) in filteredGroupedSongs" :key="key">
        <ItemGroup
          itemsContainerClass="d-inline-flex"
          :title="key.toLocaleUpperCase()"
          :items="songGroup">
          <template v-slot:item="{ item }">
            <div>
              <SimpleItem
                class="my-2 mx-2"
                :title="item.songInfo.title"
                :subtitle="item.songInfo.artist"
                data-bs-toggle="modal"
                :data-bs-target="getModalIdForSong(item, true)"/>
              <SongDetailView :purpose="updatePurpose" title="Song bearbeiten" :modalToggleId="getModalIdForSong(item, false)" :song="item" />
            </div>
          </template>
        </ItemGroup>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ItemGroup from '../components/ItemGroup'
import SimpleItem from '../components/customviews/SimpleItem'
import Divider from '../components/customviews/Divider'
import IconedButton from '../components/customviews/IconedButton'
import SongDetailView from '../views/SongDetailView'
import { UIPurpose, UIPurposeTitles } from '../businesslogic/util/UIPurpose'

export default {
  name: 'SongMenuView',
  components: {
    SimpleItem,
    Divider,
    SongDetailView,
    IconedButton,
    ItemGroup
  },
  data () {
    return {
      searchQuery: '',
      createPurpose: new UIPurpose(UIPurposeTitles.CREATE, {}),
      updatePurpose: new UIPurpose(UIPurposeTitles.UPDATE_AND_DELETE, {})
    }
  },
  methods: {
    getModalIdForSong (song, shouldDisplayIdSign) {
      return `${shouldDisplayIdSign ? '#' : ''}edit-song-modal-${song.id}`
    }
  },
  computed: {
    ...mapGetters(['getFilteredSongsGroupedByArtistFirstLetter', 'getAllSongs']),
    filteredGroupedSongs () {
      return this.getFilteredSongsGroupedByArtistFirstLetter(this.searchQuery)
    },
    noSongsAvailable () {
      return this.getAllSongs().length === 0
    }
  }
}
</script>

<style>
</style>
