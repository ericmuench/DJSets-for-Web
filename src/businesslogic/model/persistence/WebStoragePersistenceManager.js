import * as TypeAssertions from '../../util/TypeAssertions'
import { createSongsFromRawJSON, createSetlistsFromRawJSON } from '../../util/DataJSONParsing'

const SONGS_PERSISTENCE_KEY = 'songs'
const SETLISTS_PERSISTENCE_KEY = 'setlists'

export class WebStoragePersistenceManager {
  saveSongs (songs) {
    const json = JSON.stringify(songs)
    localStorage.setItem(SONGS_PERSISTENCE_KEY, json)
  }

  saveSetlists (setlists) {
    const json = JSON.stringify(setlists)
    localStorage.setItem(SETLISTS_PERSISTENCE_KEY, json)
  }

  loadSongs () {
    const dataFromJson = this.loadJSONFromLocalStorage(SONGS_PERSISTENCE_KEY, [])
    TypeAssertions.assertArrayType(dataFromJson)
    return createSongsFromRawJSON(dataFromJson, [])
  }

  loadSetlists () {
    const dataFromJson = this.loadJSONFromLocalStorage(SETLISTS_PERSISTENCE_KEY, [])
    TypeAssertions.assertArrayType(dataFromJson)
    return createSetlistsFromRawJSON(dataFromJson, [])
  }

  loadJSONFromLocalStorage (key, defaultVal) {
    const jsonStr = localStorage.getItem(key)
    return (jsonStr == null) ? defaultVal : JSON.parse(jsonStr)
  }
}
