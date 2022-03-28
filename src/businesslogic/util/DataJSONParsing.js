import { Song, SongInfo } from '../model/Songs'
import { Setlist, SetlistInfo } from '../model/Setlists'

export function createSongsFromRawJSON (jsonObj, defaultVal) {
  return parseJSON(jsonObj, defaultVal, (dataFromJson) => dataFromJson.map(dataObj => new Song(SongInfo.fromObject(dataObj.songInfo), dataObj.id)))
}

export function createSetlistsFromRawJSON (jsonObj, defaultVal) {
  return parseJSON(jsonObj, defaultVal, (dataFromJson) => dataFromJson.map(dataObj => new Setlist(SetlistInfo.fromObject(dataObj.setlistInfo), dataObj.id)))
}

function parseJSON (jsonObj, defaultVal, onMapJsonData) {
  try {
    return onMapJsonData(jsonObj)
  } catch (err) {
    console.warn(err)
    return defaultVal
  }
}
