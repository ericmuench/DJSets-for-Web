import { ConstructorError } from '../util/ErrorManagement'
import { isValidId } from '../util/Validators'
import store from '../../store/index'

export class SetlistInfo {
  static fromObject (obj) {
    return new SetlistInfo(obj.title, obj.description, obj.songIds)
  }

  constructor (title, description, songIds) {
    if (!(this.areValidConstructorArguments(title, description, songIds))) {
      throw new ConstructorError('SetlistInfo', `title was ${title}, description was ${description} and songIds were ${songIds}`)
    }

    this.description = description
    this.title = title
    this.songIds = songIds
  }

  areValidConstructorArguments (title, description, songIds) {
    // perform type checks
    return (typeof title === 'string' && typeof description === 'string' && songIds instanceof Array && songIds.every(it => Number.isInteger(it)))
  }
}

export class Setlist {
  static idGenerator = setlistIdGenerator()

  constructor (setlistInfo, id = null) {
    if (!(setlistInfo instanceof SetlistInfo)) {
      throw new ConstructorError('Setlist', `Setlistinfo-Argument seems not not be an instance of SetlistInfo. It is ${setlistInfo}`)
    }

    this.setlistInfo = setlistInfo
    this.id = (isValidId(id)) ? id : Setlist.idGenerator.next().value
  }

  regenerateId () {
    this.id = Setlist.idGenerator.next().value
  }
}

export const undefinedSetlist = { id: 0, setlistInfo: new SetlistInfo('', '', []) }

function * setlistIdGenerator () {
  let currentMaxId = store.getters.maxSetlistId()
  while (true) {
    const genId = ++currentMaxId
    console.log(`generated setlist id ${genId}`)
    yield genId
  }
}
