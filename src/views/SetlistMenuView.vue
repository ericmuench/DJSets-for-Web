<template>
  <div class="bckgrnd-mediumgray text-light p-3 min-vh-100">
      <IconedButton
        icName="ICPlus.svg"
        :shouldDisplayDescription="true"
        description="Neue Setliste erstellen"
        data-bs-toggle="modal"
        data-bs-target="#new-setlist-modal"/>
      <TitleDescriptionView
        modalTitle="Neue Setliste erstellen"
        mainActionTitle="Erstellen"
        modalToggleId="new-setlist-modal"
        :shouldResetWhenOpened="true"
        @mainaction="onCreateNewSetlist"/>
      <Divider thickness="1px"/>
      <h3 class="p-1 bold-font">Meine Setlisten</h3>
      <section v-show="noSetlistsAvailable" class="h3 font-secondary text-center mt-4">Hier sieht es recht leer aus. Füge eine Setliste über den Hinzufügen-Button ein ;)</section>
      <div
        v-for="row in setlistsTable"
        :key="row.rid">
        <div class="row m-0">
          <router-link
            class="setlist-detail-router-link col-sm-6"
            :to="{name: 'setlistdetails', params: {setlistId: row.col1.id}}">
            <SimpleItem
              class="m-2"
              :title="row.col1.setlistInfo.title"
              :subtitle="getSetlistDurationString(row.col1)"/>
          </router-link>

          <router-link
            class="setlist-detail-router-link col-sm-6"
            v-if="row.col2 != null"
            :to="{name: 'setlistdetails', params: {setlistId: row.col2.id}}">
            <SimpleItem
              class="m-2"
              :title="row.col2.setlistInfo.title"
              :subtitle="getSetlistDurationString(row.col2)"/>
          </router-link>
        </div>
      </div>
  </div>
</template>

<script>
import IconedButton from '../components/customviews/IconedButton'
import Divider from '../components/customviews/Divider'
import SimpleItem from '../components/customviews/SimpleItem'
import { mapGetters, mapActions } from 'vuex'
import TitleDescriptionView from './TitleDescriptionView.vue'
import { Setlist, SetlistInfo } from '../businesslogic/model/Setlists'

export default {
  name: 'SetlistMenuView',
  components: {
    IconedButton,
    Divider,
    SimpleItem,
    TitleDescriptionView
  },
  methods: {
    ...mapActions(['addAllSetlists']),
    onCreateNewSetlist (title, description) {
      const setlist = new Setlist(new SetlistInfo(title, description, []))
      this.addAllSetlists([setlist])
    }
  },
  computed: {
    ...mapGetters(['getAllSetlists', 'getSetlistDurationString']),
    setlistsTable () {
      const allSetlists = this.getAllSetlists()
      const newArr = []
      let rowCnt = 0
      for (let i = 0; i < allSetlists.length; i += 2) {
        const row = { rid: rowCnt, col1: allSetlists[i], col2: null }
        if (i + 1 < allSetlists.length) {
          row.col2 = allSetlists[i + 1]
        }
        newArr.push(row)
        rowCnt++
      }
      return newArr
    },
    noSetlistsAvailable () {
      return this.getAllSetlists().length === 0
    }
  }
}
</script>
<style scoped>
.setlist-detail-router-link{
  text-decoration: none;
  color: inherit;
  padding: 0;
}
</style>
