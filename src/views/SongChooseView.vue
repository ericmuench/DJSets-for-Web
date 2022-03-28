<template>
  <Modal @modalshow="reset" :title="title" :modalToggleId="modalToggleId" modalType="modal-dialog-scrollable modal-fullscreen">
    <template v-slot:modal-content>
      <input
        type="text"
        v-model="searchQuery"
        autocomplete="off"
        placeholder="Nach Song oder Interpret suchen..."
        class="form-control text-light p-2"/>
      <section v-show="noSongsAvailable" class="h3 font-secondary text-center mt-4">Hier sieht es recht leer aus. Füge einen Song über das Song-Menü ein ;)</section>
      <div v-for="(songGroup,key) in filteredGroupedSongs" :key="key">
        <ItemGroup
          :title="key.toLocaleUpperCase()"
          :items="songGroup">
          <template v-slot:item="{ item }">
            <CheckableSimpleItem
              class="my-2"
              :isChecked="isSelected(item)"
              @check="onItemSelected(item)"
              @uncheck="onItemUnselected(item)"
              :checkId="item.id"
              :title="item.songInfo.title"
              :subtitle="item.songInfo.artist" />
          </template>
        </ItemGroup>
      </div>
      <Divider thickness="1px"/>
      <h4 v-if="!noSongsAvailable">Gewählte Songs:</h4>
      <h6 v-if="!noSongsAvailable">{{selectedItems.map(it => it.songInfo.title).join(', ')}}</h6>
    </template>
    <template v-slot:modal-footer>
      <input class="py-2 px-3 btn btn-secondary" type="button" value="Abbrechen" data-bs-dismiss="modal">
      <input :disabled="!selectionAvailable" class="btn btn-success" type="button" value="Auswählen" data-bs-dismiss="modal" @click="onChooseSelected">
    </template>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import CheckableSimpleItem from '../components/customviews/CheckableSimpleItem'
import ItemGroup from '../components/ItemGroup'
import Modal from '../components/customviews/Modal'
import Divider from '../components/customviews/Divider'

export default {
  name: 'SongChooseView',
  components: {
    CheckableSimpleItem,
    ItemGroup,
    Modal,
    Divider
  },
  props: {
    title: String,
    modalToggleId: String
  },
  data () {
    return {
      selectedItems: [],
      searchQuery: ''
    }
  },
  methods: {
    onItemSelected (item) {
      this.selectedItems.push(item)
    },
    onItemUnselected (item) {
      this.selectedItems = this.selectedItems.filter(it => it.id !== item.id)
    },
    onChooseSelected () {
      this.$emit('songschoose', this.selectedItems)
    },
    isSelected (item) {
      return this.selectedItems.includes(item)
    },
    reset () {
      this.selectedItems = []
    }
  },
  computed: {
    ...mapGetters(['getAllSongs', 'getFilteredSongsGroupedByArtistFirstLetter']),
    filteredGroupedSongs () {
      return this.getFilteredSongsGroupedByArtistFirstLetter(this.searchQuery)
    },
    noSongsAvailable () {
      return this.getAllSongs().length === 0
    },
    selectionAvailable () {
      return this.selectedItems.length > 0
    }
  }
}
</script>
