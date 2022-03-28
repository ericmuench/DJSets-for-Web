<template>
    <Modal @modalshow="onOpen" :title="title" :modalToggleId="modalToggleId" modalType="modal-fullscreen">
        <template v-slot:modal-content>
            <form class="bckgrnd-mediumgray p-3 container-fluid text-light">
                <div class="p-2 row">
                    <!--Song title-->
                    <label class="h5 col-2 p-2 form-label bold-font needs-validation" :for="`song-detail-view-input-song-title-${getSongSpecificFormSuffix()}`">Titel</label>
                    <input :class="[validator.validateTitle(songTitleString) ? 'is-valid' : 'is-invalid','text-light col-sm p-2 form-control shadow-sm']"
                        :id="`song-detail-view-input-song-title-${getSongSpecificFormSuffix()}`"
                        type="text"
                        autocomplete="off"
                        v-model="songTitleString"
                        placeholder="Bitte Titel eingeben..."
                        required>
                </div>
                <!--Artist-->
                <div class="p-2 row">
                    <label class="h5 col-2 p-2 form-label bold-font needs-validation" :for="`song-detail-view-input-artist-${getSongSpecificFormSuffix()}`">Interpret</label>
                    <input :class="[validator.validateArtist(songArtistString) ? 'is-valid' : 'is-invalid','text-light col-sm p-2 form-control shadow-sm']"
                        :id="`song-detail-view-input-artist-${getSongSpecificFormSuffix()}`"
                        type="text"
                        autocomplete="off"
                        v-model="songArtistString"
                        placeholder="Bitte Interpret eingeben..."
                        required>
                </div>
                <Divider thickness="1px"/>
                <div class="row">
                    <!--Music Scale-->
                    <div class="col-sm">
                        <label class="h5 py-2 form-label bold-font" :for="`song-detail-view-input-musicscale-${getSongSpecificFormSuffix()}`">Tonart</label>
                        <select  v-model="songMusicScale" class= "text-light p-2 form-select shadow-sm" :id="`song-detail-view-input-musicscale-${getSongSpecificFormSuffix()}`">
                          <option v-for="scale in musicScales" :value="scale" :key="scale.title">
                            {{ scale.getMajorMinorRepresentation() }}
                          </option>
                        </select>
                    </div>
                    <div class="col-sm">
                        <!--Tempo-->
                        <label class="h5 py-2 form-label bold-font needs-validation" :for="`song-detail-view-input-tempo-${getSongSpecificFormSuffix()}`">Tempo</label>
                        <div class="d-flex flex-row align-items-center">
                            <input :class="[validator.validateTempo(songTempo) ? 'is-valid' : 'is-invalid','text-light p-2 form-control shadow-sm']"
                            :id="`song-detail-view-input-tempo-${getSongSpecificFormSuffix()}`"
                            type="number"
                            v-model.number="songTempo"
                            :min="MIN_BPM_VALUE"
                            :max="MAX_BPM_VALUE"
                            autocomplete="off"
                            placeholder="Bitte Tempo in BPM eingeben..."
                            required>
                            <p class="h6 my-auto mx-2">BPM</p>
                        </div>
                    </div>
                    <div class="col-sm">
                        <!--genre-->
                        <label class="h5 py-2 form-label bold-font" :for="`song-detail-view-input-genre-${getSongSpecificFormSuffix()}`">Genre</label>
                        <input class="text-light p-2 form-control shadow-sm"
                            :id="`song-detail-view-input-genre-${getSongSpecificFormSuffix()}`"
                            type="text"
                            v-model="songGenre"
                            autocomplete="off"
                            placeholder="Bitte Genre eingeben...">
                    </div>
                    <div class="col-sm">
                        <!--duration-->
                        <label class="h5 py-2 form-label bold-font needs-validation" :for="`song-detail-view-input-duration-${getSongSpecificFormSuffix()}`">Länge</label>
                        <div class="d-flex flex-row align-items-center">
                            <input :class="[validator.validateDuration(songDurationString) ? 'is-valid' : 'is-invalid','text-light p-2 form-control shadow-sm']"
                            :id="`song-detail-view-input-duration-${getSongSpecificFormSuffix()}`"
                            type="text"
                            v-model="songDurationString"
                            autocomplete="off"
                            placeholder="Bitte Länge im mm:ss-Format eingeben..."
                            required/>
                            <p class="h6 my-auto mx-2">min</p>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template v-slot:modal-footer>
            <div class="mt-4 p-2 d-flex flex-wrap justify-content-end gap-3">
                <input class="py-2 px-3 btn btn-secondary" type="button" value="Abbrechen" data-bs-dismiss="modal">
                <input
                  class="py-2 px-3 btn btn-danger"
                  v-show="hasUpdateAndDeletePurpose"
                  :disabled="!canDeleteSong"
                  type="button"
                  :id="`btn-delete-song-${getSongSpecificFormSuffix()}`"
                  @click.prevent="onDeleteSong"
                  value="Löschen"
                  data-bs-dismiss="modal">
                <input
                    class="py-2 px-3 btn btn-success"
                    type="submit"
                    :value="saveActionTitle"
                    :disabled="!validator.validateAll(songTitleString,songArtistString,songDurationString,songTempo)"
                    @click.prevent="onSave"
                    data-bs-dismiss="modal">
            </div>
        </template>
    </Modal>
</template>

<script>
import Divider from '../components/customviews/Divider'
import Modal from '../components/customviews/Modal'

import { mapActions } from 'vuex'

import { defaultMusicScales } from '../businesslogic/model/musictheory/ToneScales'
import { Song, SongInfo } from '../businesslogic/model/Songs'
import { SongDetailViewValidator, MIN_BPM_VALUE, MAX_BPM_VALUE } from '../businesslogic/util/Validators'
import { TimeFormatConverter } from '../businesslogic/util/TimeFormatConverter'
import { UIPurpose, UIPurposeTitles } from '../businesslogic/util/UIPurpose'

export default {
  name: 'SongDetailView',
  components: {
    Divider,
    Modal
  },
  props: {
    title: String,
    modalToggleId: String,
    song: Song,
    saveActionTitle: {
      type: String,
      default: 'Speichern'
    },
    purpose: {
      type: UIPurpose,
      required: true
    }
  },
  data () {
    const defaultValues = {
      defaultTitle: '',
      defaultArtist: '',
      defaultScale: defaultMusicScales.NotDefined,
      defaultTempo: 0,
      defaultGenre: '',
      defaultDurationString: '00:00'
    }

    return {
      validator: new SongDetailViewValidator(),
      timeFormatConverter: new TimeFormatConverter(),
      musicScales: defaultMusicScales,
      MIN_BPM_VALUE: MIN_BPM_VALUE,
      MAX_BPM_VALUE: MAX_BPM_VALUE,
      formDefaultValues: defaultValues,
      songTitleString: defaultValues.defaultTitle,
      songArtistString: defaultValues.defaultArtist,
      songMusicScale: defaultValues.defaultScale,
      songTempo: defaultValues.defaultTempo,
      songGenre: defaultValues.defaultGenre,
      songDurationString: defaultValues.defaultDurationString
    }
  },
  methods: {
    ...mapActions(['addAllSongs', 'deleteSong', 'updateSong', 'addSongsToSetlist']),
    onSave (e) {
      this.wasValidated = true
      const songInfo = new SongInfo(
        this.songTitleString,
        this.songArtistString,
        this.songMusicScale,
        this.songTempo,
        this.songGenre,
        this.timeFormatConverter.convertToTimeMillis(this.songDurationString))

      if (this.hasCreatePurpose) {
        this.addAllSongs([new Song(songInfo)])
      }

      if (this.hasUpdateAndDeletePurpose) {
        const song = this.song
        this.updateSong({ song, songInfo })
      }

      if (this.hasAddNewPurpose) {
        const newSongs = [new Song(songInfo)]
        this.addAllSongs(newSongs)
        this.addSongsToSetlist({ songs: newSongs, setlist: this.purpose.metaInfo.setlist })
      }
    },
    onDeleteSong () {
      const deletePermission = confirm(`Soll der Song "${this.song.songInfo.artist} - ${this.song.songInfo.title}" wirklich gelöscht werden?`)
      if (deletePermission) {
        this.deleteSong(this.song)
      }
    },
    getSongSpecificFormSuffix () {
      return this.song?.id?.toString() ?? 'new'
    },
    onOpen () {
      if (this.hasCreatePurpose || this.hasAddNewPurpose) {
        this.resetFormValues()
      }

      if (this.hasUpdateAndDeletePurpose) {
        this.applySongValues()
      }
    },
    resetFormValues () {
      this.songTitleString = this.formDefaultValues.defaultTitle
      this.songArtistString = this.formDefaultValues.defaultArtist
      this.songMusicScale = this.formDefaultValues.defaultScale
      this.songTempo = this.formDefaultValues.defaultTempo
      this.songGenre = this.formDefaultValues.defaultGenre
      this.songDurationString = this.formDefaultValues.defaultDurationString
    },
    applySongValues () {
      this.songTitleString = this.song.songInfo.title
      this.songArtistString = this.song.songInfo.artist
      this.songMusicScale = this.song.songInfo.musicscale
      this.songTempo = this.song.songInfo.tempo
      this.songGenre = this.song.songInfo.genre
      this.songDurationString = this.timeFormatConverter.convertToDurationString(this.song.songInfo.duration)
    }
  },
  computed: {
    hasUpdateAndDeletePurpose () {
      return this.purpose.title === UIPurposeTitles.UPDATE_AND_DELETE
    },
    hasCreatePurpose () {
      return this.purpose.title === UIPurposeTitles.CREATE
    },
    hasAddNewPurpose () {
      return this.purpose.title === UIPurposeTitles.ADD_NEW
    },
    canDeleteSong () {
      return this.hasUpdateAndDeletePurpose && this.formDataEqualsSongData
    },
    formDataEqualsSongData () {
      return this.songTitleString === this.song.songInfo.title &&
             this.songArtistString === this.song.songInfo.artist &&
             this.songMusicScale === this.song.songInfo.musicscale &&
             this.songTempo === this.song.songInfo.tempo &&
             this.songGenre === this.song.songInfo.genre &&
             this.songDurationString === this.timeFormatConverter.convertToDurationString(this.song.songInfo.duration)
    }
  }
}
</script>
<style scoped>
p,label{
  word-break: keep-all;
}
</style>
