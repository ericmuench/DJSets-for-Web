import { isNotEmptyOrBlank } from './StringUtils'

export class SongDetailViewValidator {
  // title, artist, duration, tempo
  validateTitle (title) {
    return isNotEmptyOrBlank(title)
  }

  validateArtist (artist) {
    return isNotEmptyOrBlank(artist)
  }

  validateDuration (durationString) {
    return isValidDurationString(durationString)
  }

  validateTempo (bpm) {
    return isValidBpmValue(bpm)
  }

  validateAll (title, artist, duration, tempo) {
    return this.validateTitle(title) && this.validateArtist(artist) && this.validateDuration(duration) && this.validateTempo(tempo)
  }
}

// Public Validator Functions
export function isValidDurationString (durationString) {
  return /^([1-9][0-9]*|0[0-9]?):[0-5][0-9]$/.test(durationString)
}

export function isPositiveIntegerNumber (numberStr) {
  return /^(0|[1-9]+[0-9]*)$/.test(numberStr)
}

export function isValidId (id) {
  return Number.isInteger(id) && id > 0
}

export function isValidFileName (fileName) {
  return !(/^(.*[/?<>\\\\:\\*|"]+.*)*$/.test(fileName))
}

// Private Validator Functions
function isValidBpmValue (bpm) {
  let validationResult = false

  if (typeof bpm === 'string') {
    validationResult = /^(([1-5]?[1-9]?|[1-5][0-9]?)[0-9])$/.test(bpm)
  } else if (typeof bpm === 'number') {
    validationResult = bpm >= MIN_BPM_VALUE && bpm < MAX_BPM_VALUE
  }

  return validationResult
}

// simple validation constants
export const MIN_BPM_VALUE = 0
export const MAX_BPM_VALUE = 599
