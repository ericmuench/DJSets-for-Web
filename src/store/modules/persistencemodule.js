import { WebStoragePersistenceManager } from '../../businesslogic/model/persistence/WebStoragePersistenceManager'
import { SetlistInfo } from '../../businesslogic/model/Setlists'
import { SongInfo } from '../../businesslogic/model/Songs'

const state = {
  wsPersistenceManager: new WebStoragePersistenceManager()
}

const getters = {
  songsFromWebStorage: (state) => state.wsPersistenceManager.loadSongs(),
  setlistsFromWebStorage: (state) => state.wsPersistenceManager.loadSetlists(),
  /**
   * The following getter removes all data stored in a song that is associated with the ToneScale except the title.
   * This helps to improve the performance and saves memory for the persisted data. All information about the
   * tonescale can be resolved again after reassigning it to the right defaultMusicScale-Property while
   * converting the data into the correct data type. The latter is done by the functions defined in DataJSONParsing.js
   */
  reducedSongs: (_, getters) => {
    return getters.getAllSongs().map(song => {
      const songObj = JSON.parse(JSON.stringify(song))
      songObj.songInfo.musicscale = { title: song.songInfo.musicscale.title }
      return songObj
    })
  },
  applicationDataAsJson: (_, getters) => {
    const songs = getters.reducedSongs
    const setlists = getters.getAllSetlists()
    return JSON.stringify({ setlists: setlists, songs: songs })
  }
}

const actions = {
  persistSongsInWebStorage ({ state, getters }) {
    const songs = getters.reducedSongs
    state.wsPersistenceManager.saveSongs(songs)
  },
  persistSetlistsInWebStorage ({ state, getters }) {
    const setlists = getters.getAllSetlists()
    state.wsPersistenceManager.saveSetlists(setlists)
  },
  restoreDataFromWebStorage ({ getters, dispatch }) {
    dispatch('addAllSongs', getters.songsFromWebStorage)
    dispatch('addAllSetlists', getters.setlistsFromWebStorage)
  },
  /**
   * This action merges new songs and setlists into the existing set of songs and setlists by reassigning ids.
   * This indicates that duplicates in data might occur (e.g. 2 Songs or 2 Setlists with same title). The only relevant and unique parameter is the
   * id of the Setlists and Songs.
   */
  mergeExternalDataByIdReassign ({ dispatch }, { songs, setlists }) {
    const reassignedData = performCompleteIdReassign(songs, setlists)
    dispatch('addAllSongs', reassignedData.songs)
    dispatch('addAllSetlists', reassignedData.setlists)
  },
  /**
   * This action merges new songs and setlists into the existing set of songs and setlists by updating relevant parameters of existing songs.
   * It only adds Songs and Setlists where those relevant parameters are not already contained in the set of songs and setlists.
   * The relevant param for songs is the combination of Artist and Title. The relevant param for setlists is the title.
   */
  mergeExternalDataByUpdateExistingElements ({ getters, dispatch }, { songs, setlists }) {
    // Songs
    const existingSongs = getters.getAllSongs()
    const addSongs = []
    const newAssignedSongIds = []
    songs.sort((s1, s2) => s1.id - s2.id).forEach(song => {
      const existingSong = existingSongs.find(it => it.songInfo.artist === song.songInfo.artist && it.songInfo.title === song.songInfo.title)
      if (existingSong !== undefined) {
        // UPDATE
        const newSongInfo = new SongInfo(
          song.songInfo.title,
          song.songInfo.artist,
          song.songInfo.musicscale,
          song.songInfo.tempo,
          song.songInfo.genre,
          song.songInfo.duration
        )
        dispatch('updateSong', { song: existingSong, songInfo: newSongInfo })
      } else {
        // 'ADD'
        const oldSongId = song.id
        if (existingSongs.some(s => s.id === oldSongId) || newAssignedSongIds.some(idTuple => idTuple.newId === oldSongId)) {
          song.regenerateId()
          newAssignedSongIds.push({ oldId: oldSongId, newId: song.id })
        }
        addSongs.push(song)
      }
    })

    // Setlists
    const addSetlists = []
    const existingSetlists = getters.getAllSetlists()
    setlists.forEach(setlist => {
      const newSongIds = setlist.setlistInfo.songIds.map(songId => {
        const idTuple = newAssignedSongIds.find(it => it.oldId === songId)
        return (idTuple !== undefined) ? idTuple.newId : songId
      })
      setlist.setlistInfo.songIds = newSongIds
      const existingSetlist = existingSetlists.find(it => it.setlistInfo.title === setlist.setlistInfo.title)
      if (existingSetlist !== undefined) {
        // UPDATE
        const newSetlistInfo = new SetlistInfo(setlist.setlistInfo.title, setlist.setlistInfo.description, setlist.setlistInfo.songIds)
        dispatch('updateSetlist', { setlist: existingSetlist, setlistInfo: newSetlistInfo })
      } else {
        // 'ADD'
        addSetlists.push(setlist)
      }
    })

    dispatch('mergeExternalDataByIdReassign', { songs: addSongs, setlists: addSetlists })
  },
  /**
   * This function integrates new songs and setlists into the existing set of songs and setlists by setting their values to the internal states of the song-
   * and setlistmodule. All previous data is overridden, but nevertheless ids are reassigned.
   */
  integrateExternalDataByOverride ({ dispatch }, { songs, setlists }) {
    const reassingedData = performCompleteIdReassign(songs, setlists)
    dispatch('clearSongs')
    dispatch('addAllSongs', reassingedData.songs)
    dispatch('clearSetlists')
    dispatch('addAllSetlists', reassingedData.setlists)
  }
}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}

// help functions
function performCompleteIdReassign (newSongs, newSetlists) {
  // Remove all Songids from setlists that not exists in the new songs
  let reassingedSetlists = newSetlists.map(setlist => {
    setlist.setlistInfo.songIds = setlist
      .setlistInfo
      .songIds
      .filter(id => newSongs.some(song => song.id === id))
    return setlist
  })
  // the following object should track the changes for an songId-Reassigning
  // It maps an index of the setlist-array to an array of indices that have been changed in the corresponding elements songIds-Property
  const setlistSongIdsChangeTracker = {}
  const reassignedSongs = newSongs.map(song => {
    const oldId = song.id
    song.regenerateId()
    reassingedSetlists = reassingedSetlists.map((setlist, setlistIndex, _) => {
      setlistSongIdsChangeTracker[setlistIndex] =
        (setlistSongIdsChangeTracker[setlistIndex] === undefined) ? [] : setlistSongIdsChangeTracker[setlistIndex]
      setlist.setlistInfo.songIds = setlist
        .setlistInfo
        .songIds
        .map((id, idIndex, _) => {
          if (id === oldId && !(setlistSongIdsChangeTracker[setlistIndex].includes(idIndex))) {
            setlistSongIdsChangeTracker[setlistIndex] = [...setlistSongIdsChangeTracker[setlistIndex], idIndex]
            return song.id
          } else {
            return id
          }
        })
      return setlist
    })
    return song
  })

  reassingedSetlists = reassingedSetlists.map(setlist => {
    setlist.regenerateId()
    return setlist
  })

  return { songs: reassignedSongs, setlists: reassingedSetlists }
}
