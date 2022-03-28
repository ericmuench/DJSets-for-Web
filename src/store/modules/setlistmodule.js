import { SetlistInfo } from '../../businesslogic/model/Setlists'
import { TimeFormatConverter } from '../../businesslogic/util/TimeFormatConverter'
import { assertSetlistArrayType, assertSetlistInfoType, assertSetlistType, assertSongType } from '../../businesslogic/util/TypeAssertions'
import { moveElement } from '../../businesslogic/util/ListUtils'

const timeConverter = new TimeFormatConverter()

const state = {
  setlists: {}
}

const getters = {
  getAllSetlists: (state) => () => {
    return Object.values(state.setlists).sort((s1, s2) => s1.id - s2.id)
  },
  getSetlistById: (state) => (id) => {
    return state.setlists[id]
  },
  getAllSongsOfSetlist: (_, getters) => (setlist) => {
    return setlist.setlistInfo.songIds.map(songId => getters.getSongById(songId)).filter(song => song !== undefined)
  },
  getSetlistDuration: (_, getters) => (setlist) => {
    return getters.getAllSongsOfSetlist(setlist).map(song => song.songInfo.duration).reduce((total, duration) => total + duration, 0)
  },
  getSetlistDurationString: (_, getters) => (setlist) => {
    const formattedDuration = timeConverter.convertToDurationString(getters.getSetlistDuration(setlist))
    return `${formattedDuration} min`
  },
  setlistAsShareable: (_, getters) => (setlist) => {
    const songs = getters.getAllSongsOfSetlist(setlist)
    const duration = getters.getSetlistDurationString(setlist)
    return `${setlist.setlistInfo.title} (${duration})\n\n${setlist.setlistInfo.description}\n\n\n${songs.map((s, index) => `${index + 1})  ${s.asShareableString()}`).join('\n')}`
  },
  maxSetlistId: (_, getters) => () => {
    const ids = getters.getAllSetlists().map(it => it.id)
    return (ids.length === 0) ? 0 : Math.max(...ids)
  },
  doesSetlistIdExist: (state) => (id) => {
    return id in state.setlists
  }
}

const actions = {
  // dispatch actions
  deleteSongFromSetlistIndexed ({ dispatch }, { setlist, index }) {
    const newSongIds = [...setlist.setlistInfo.songIds]
    newSongIds.splice(index, 1)
    const setlistInfo = new SetlistInfo(setlist.setlistInfo.title, setlist.setlistInfo.description, newSongIds)
    dispatch('updateSetlist', { setlist, setlistInfo })
  },
  deleteSongFromSetlist ({ dispatch }, { setlist, song }) {
    const newSongIds = [...setlist.setlistInfo.songIds].filter(id => id !== song.id)
    const setlistInfo = new SetlistInfo(setlist.setlistInfo.title, setlist.setlistInfo.description, newSongIds)
    dispatch('updateSetlist', { setlist, setlistInfo })
  },
  deleteSongFromAllSetlists ({ dispatch, getters }, song) {
    // Delete song globally from all setlists where it is contained
    getters
      .getAllSetlists()
      .filter(setlist => setlist.setlistInfo.songIds.includes(song.id))
      .forEach(setlist => dispatch('deleteSongFromSetlist', { setlist, song }))
  },
  updateSongIdForAllSetlists ({ dispatch, getters }, { oldId, newId }) {
    getters
      .getAllSetlists()
      .filter(setlist => setlist.setlistInfo.songIds.includes(oldId))
      .forEach(setlist => {
        const newSongIds = setlist.setlistInfo.songIds.map(id => (id === oldId) ? newId : id)
        const setlistInfo = new SetlistInfo(setlist.setlistInfo.title, setlist.setlistInfo.description, newSongIds)
        dispatch('updateSetlist', { setlist, setlistInfo })
      })
  },
  addSongsToSetlist ({ dispatch }, { songs, setlist }) {
    songs.forEach(song => assertSongType(song))
    assertSetlistType(setlist)
    const newSongIds = setlist.setlistInfo.songIds.concat(songs.map(it => it.id))
    const setlistInfo = new SetlistInfo(setlist.setlistInfo.title, setlist.setlistInfo.description, newSongIds)
    dispatch('updateSetlist', { setlist, setlistInfo })
  },
  moveSongInSetlist ({ dispatch }, { setlist, fromIndex, toIndex }) {
    assertSetlistType(setlist)
    if (fromIndex === toIndex ||
        fromIndex < 0 ||
        fromIndex >= setlist.setlistInfo.songIds.length ||
        toIndex < 0 ||
        toIndex >= setlist.setlistInfo.songIds.length) {
      return
    }
    const newSongIds = moveElement(setlist.setlistInfo.songIds, fromIndex, toIndex)
    const setlistInfo = new SetlistInfo(setlist.setlistInfo.title, setlist.setlistInfo.description, newSongIds)
    dispatch('updateSetlist', { setlist, setlistInfo })
  },
  updateSetlistTitleDescription ({ dispatch }, { setlist, title, description }) {
    const newSetlistInfo = new SetlistInfo(title, description, setlist.setlistInfo.songIds)
    dispatch('updateSetlist', { setlist: setlist, setlistInfo: newSetlistInfo })
  },
  // mutation actions
  updateSetlist ({ commit, dispatch }, { setlist, setlistInfo }) {
    assertSetlistType(setlist)
    assertSetlistInfoType(setlistInfo)
    commit('updateSetlistMutation', { setlist, setlistInfo })
    dispatch('persistSetlistsInWebStorage')
  },
  addAllSetlists ({ dispatch, commit }, setlists) {
    assertSetlistArrayType(setlists)
    commit('addAllSetlistMutation', setlists)
    dispatch('persistSetlistsInWebStorage')
  },
  deleteSetlist ({ dispatch, commit }, setlist) {
    assertSetlistType(setlist)
    commit('deleteSetlistMutation', setlist)
    dispatch('persistSetlistsInWebStorage')
  },
  clearSetlists ({ commit, dispatch }) {
    commit('clearSetlistsMutation')
    dispatch('persistSetlistsInWebStorage')
  }
}

const mutations = {
  addAllSetlistMutation: (state, setlists) => {
    setlists.forEach(it => {
      const existingSetlist = state.setlists[it.id]
      if (existingSetlist !== undefined) {
        console.warn(`Overriding existing Setlist of ${existingSetlist} with add function`)
      }
      state.setlists[it.id] = it
    })
  },
  deleteSetlistMutation: (state, setlist) => {
    delete state.setlists[setlist.id]
  },
  clearSetlistsMutation: (state) => {
    state.setlists = {}
  },
  updateSetlistMutation: (state, { setlist, setlistInfo }) => {
    state.setlists[setlist.id].setlistInfo = setlistInfo
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
