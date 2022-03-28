import { TypeMismatchError } from './ErrorManagement'
import { Song, SongInfo } from '../model/Songs'
import { Setlist, SetlistInfo } from '../model/Setlists'

export function assertSetlistType (setlist) {
  if (!(setlist instanceof Setlist)) {
    throw new TypeMismatchError('Setlist', typeof setlist)
  }
}

export function assertSetlistInfoType (setlistInfo) {
  if (!(setlistInfo instanceof SetlistInfo)) {
    throw new TypeMismatchError('SetlistInfo', typeof setlistInfo)
  }
}

export function assertSongType (song) {
  if (!(song instanceof Song)) {
    throw new TypeMismatchError('Song', typeof song)
  }
}

export function assertSongInfoType (songInfo) {
  if (!(songInfo instanceof SongInfo)) {
    throw new TypeMismatchError('SongInfo', typeof songInfo)
  }
}

export function assertArrayType (arr) {
  if (!(arr instanceof Array)) {
    throw new TypeMismatchError('Array', typeof arr)
  }
}

export function assertSongArrayType (songs) {
  assertArrayType(songs)
  songs.forEach(it => assertSongType(it))
}

export function assertSetlistArrayType (setlists) {
  assertArrayType(setlists)
  setlists.forEach(it => assertSetlistType(it))
}
