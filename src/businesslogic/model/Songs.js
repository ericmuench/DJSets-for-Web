import { MajorMinorToneScale, getDefaultMusicScaleByTitle } from './musictheory/ToneScales'
import { ConstructorError } from '../util/ErrorManagement'
import { TimeFormatConverter } from '../util/TimeFormatConverter'
import { isValidId } from '../util/Validators'
import store from '../../store/index'

export class SongInfo {
  static fromObject (obj) {
    return new SongInfo(obj.title, obj.artist, getDefaultMusicScaleByTitle(obj.musicscale.title), obj.tempo, obj.genre, obj.duration)
  }

  constructor (title, artist, musicscale, tempo, genre, duration) {
    if (!this.areValidConstructorArguments(title, artist, musicscale, tempo, genre, duration)) {
      throw new ConstructorError('SongInfo', `Arguments were:\nTitle:${title}\nArtist:${artist}\nMusicScale:${musicscale}\nTempo:${tempo}\nGenre:${genre}\nduration:${duration}`)
    }
    this.title = title
    this.artist = artist
    this.musicscale = musicscale
    this.duration = duration
    this.tempo = tempo
    this.genre = genre
  }

  areValidConstructorArguments (title, artist, musicscale, tempo, genre, duration) {
    // perform type checks
    return (typeof title === 'string' && typeof artist === 'string' && typeof tempo === 'number' && typeof genre === 'string' && typeof duration === 'number' && MajorMinorToneScale.isMajorMinorToneScale(musicscale))
  }
}

export class Song {
  static idGenerator = songIdGenerator()

  constructor (songInfo, id = null) {
    if (!(songInfo instanceof SongInfo)) {
      throw new ConstructorError('Song', `songInfo-Argument was not of type SongInfo and was ${songInfo}`)
    }

    this.songInfo = songInfo
    this.id = (isValidId(id)) ? id : Song.idGenerator.next().value
  }

  asShareableString () {
    const durationString = new TimeFormatConverter().convertToDurationString(this.songInfo.duration)
    return `${this.songInfo.artist} - ${this.songInfo.title} (${durationString}, ${this.songInfo.musicscale.getMajorMinorRepresentation()}, ${this.songInfo.tempo} BPM)`
  }

  regenerateId () {
    this.id = Song.idGenerator.next().value
  }
}

function * songIdGenerator () {
  let currentMaxId = store.getters.maxSongId()
  while (true) {
    const genId = ++currentMaxId
    console.log(`generated song id ${genId}`)
    yield genId
  }
}
