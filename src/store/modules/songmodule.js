import { isNotEmptyOrBlank } from '../../businesslogic/util/StringUtils'
import { groupBy } from '../../businesslogic/util/ListUtils'
import { assertSongInfoType, assertSongType, assertSongArrayType } from '../../businesslogic/util/TypeAssertions'

const state = {
  songs: {}
}

const getters = {
  getAllSongs: (state) => () => {
    return Object.values(state.songs)
  },
  getFilteredSongs: (_, getters) => (searchQuery) => {
    const allSongs = getters.getAllSongs()
    const sortedItems = [...allSongs].sort(function (el1, el2) {
      return el1.songInfo.artist.localeCompare(el2.songInfo.artist)
    })

    return sortedItems.filter(it => {
      const lowerSearchQuery = searchQuery.toLocaleLowerCase()
      if (isNotEmptyOrBlank(lowerSearchQuery)) {
        return it.songInfo.artist.toLocaleLowerCase().includes(lowerSearchQuery) || it.songInfo.title.toLocaleLowerCase().includes(lowerSearchQuery)
      }
      return true
    })
  },
  getFilteredSongsGroupedByArtistFirstLetter: (_, getters) => (searchQuery) => {
    const res = groupBy(getters.getFilteredSongs(searchQuery), function (element) {
      const artistName = element.songInfo.artist
      return (artistName.length === 0) ? 'Andere' : artistName[0].toLocaleLowerCase()
    })
    return res
  },
  getSongById: (state) => (id) => {
    return state.songs[id]
  },
  maxSongId: (_, getters) => () => {
    const ids = getters.getAllSongs().map(it => it.id)
    return (ids.length === 0) ? 0 : Math.max(...ids)
  }
}

const actions = {
  addAllSongs ({ commit, dispatch }, songs) {
    assertSongArrayType(songs)
    commit('addAllSongsMutation', songs)
    dispatch('persistSongsInWebStorage')
  },
  deleteSong ({ commit, dispatch }, song) {
    assertSongType(song)
    commit('deleteSongMutation', song)
    dispatch('deleteSongFromAllSetlists', song)
    dispatch('persistSongsInWebStorage')
  },
  clearSongs ({ commit, dispatch }) {
    commit('clearSongsMutation')
    dispatch('persistSongsInWebStorage')
  },
  updateSong ({ commit, dispatch }, { song, songInfo }) {
    assertSongType(song)
    assertSongInfoType(songInfo)
    commit('updateSongMutation', { song, songInfo })
    dispatch('persistSongsInWebStorage')
  }
}

const mutations = {
  addAllSongsMutation: (state, songs) => {
    songs.forEach(song => {
      const existingSong = state.songs[song.id]
      if (existingSong !== undefined) {
        console.warn(`Overriding existing song of ${existingSong} with add function`)
      }
      state.songs[song.id] = song
    })
  },
  clearSongsMutation: (state) => {
    state.songs = {}
  },
  deleteSongMutation: (state, song) => {
    delete state.songs[song.id]
  },
  updateSongMutation: (state, { song, songInfo }) => {
    state.songs[song.id].songInfo = songInfo
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
