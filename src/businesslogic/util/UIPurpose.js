import { ConstructorError } from './ErrorManagement'

/**
 * This class defines a purpose of a certain UI that can be used to distinguish between several functionality
 * of the UI based on the data it carries.
 * @field title : Should be the name of the purpose, e.g. add, create, update, delete or any name that fits the current purpose
 * @field metaInfo: Should be used to use additional information for the given purpose
 */
export class UIPurpose {
  constructor (title, metaInfo) {
    if (typeof title !== 'string' || typeof metaInfo !== 'object') {
      throw new ConstructorError('UIPurpose', `Title should be string and was ${typeof title}. Title should be object and was ${typeof metaInfo}.`)
    }
    this.title = title
    this.metaInfo = metaInfo
  }
}

/**
 * This object defines some default UIPurpose-Titles that are really common and can be used as a title for an UIPurpose
 */
export const UIPurposeTitles = {
  ADD: 'ADD',
  ADD_NEW: 'ADD_NEW',
  ADD_EXISTING: 'ADD_EXISTING',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  UPDATE_AND_DELETE: 'UPDATE_AND_DELETE',
  READ: 'READ',
  DELETE: 'DELETE'
}
