import { isNotEmptyOrBlank } from '../../util/StringUtils'
import { Tone } from './Tone'
import { defaultCircleOfFifths } from './CircleOfFifths'
import { ConstructorError } from '../../util/ErrorManagement'

/**
 * This class represents a tonescale with a title and all relevant tones
 */
class ToneScale {
  constructor (title, tones) {
    if (typeof title !== 'string' || !(isNotEmptyOrBlank(title)) || !(tones instanceof Array) || !(tones.every(t => t instanceof Tone))) {
      throw new ConstructorError('ToneScale', `Title was ${title} and tones was ${tones}`)
    }

    this.title = title
    this.tones = tones
  }
}

/**
 * This class represents a TonScale that can be represented in Major & Minor
 */
export class MajorMinorToneScale extends ToneScale {
  get [Symbol.toStringTag] () {
    return 'MajorMinorToneScale'
  }

  getMajorMinorRepresentation () {
    return this.title
  }

  getMinorRepresentation () {
    return this.title
  }

  getMajorRepresentation () {
    return this.title
  }

  static isMajorMinorToneScale (obj) {
    return obj[Symbol.toStringTag] === 'MajorMinorToneScale'
  }
}

/**
 * This class represents an ionic tonescale of 7 Tones with the small tonesteps between tone #3 and tone #4 (and tone #7 and tone #8 if #8 would count)
 * for a given root-tone. This kind of scale can be interpreted in several kinds of ways, e.g. in a minor way, a major way or any other church mode
 */
export class IonicToneScale extends MajorMinorToneScale {
  constructor (baseTone) {
    if (!(baseTone instanceof Tone)) {
      throw new ConstructorError('IonicToneScale', `BaseTone was ${baseTone}`)
    }
    super(`${baseTone.title}-Ionic`, IonicToneScale.createIonicToneScale(baseTone))
    this.baseTone = baseTone
  }

  getMajorRepresentation () {
    return this.baseTone.title
  }

  getMinorRepresentation () {
    // getting 6th tone of scale
    return `${this.tones[5].title}m`
  }

  getMajorMinorRepresentation () {
    return `${this.getMajorRepresentation()}/${this.getMinorRepresentation()}`
  }

  static createIonicToneScale (baseTone) {
    if (defaultCircleOfFifths.flatKeys.some(flatTone => baseTone.exactEquals(flatTone))) {
      return IonicToneScale.createFlatIonicToneScale(baseTone)
    }

    return IonicToneScale.createSharpIonicToneScale(baseTone)
  }

  static createSharpIonicToneScale (baseTone) {
    const tones = []
    let currentTone = baseTone
    for (let i = 1; i < 8; i++) {
      tones.push(currentTone)
      currentTone = (i === 3) ? currentTone.nextSemiTone() : currentTone.nextTone()
    }
    return tones
  }

  static createFlatIonicToneScale (baseTone) {
    return IonicToneScale.createSharpIonicToneScale(baseTone).map(it => it.sharpToFlat())
  }
}

/**
 * This class represents a ToneScale for a non-defined Key of a song
 */
export class NotDefinedToneScale extends MajorMinorToneScale {
  constructor () {
    super('-', [])
  }
}

/**
 * This constant field contains all possible ToneScales for this app
 */
export const defaultMusicScales = {
  C: new IonicToneScale(new Tone('C')),
  CSharp: new IonicToneScale(new Tone('C#')),
  D: new IonicToneScale(new Tone('D')),
  EFlat: new IonicToneScale(new Tone('Eb')),
  E: new IonicToneScale(new Tone('E')),
  F: new IonicToneScale(new Tone('F')),
  FSharp: new IonicToneScale(new Tone('F#')),
  G: new IonicToneScale(new Tone('G')),
  AFlat: new IonicToneScale(new Tone('Ab')),
  A: new IonicToneScale(new Tone('A')),
  BFlat: new IonicToneScale(new Tone('Bb')),
  B: new IonicToneScale(new Tone('B')),
  NotDefined: new NotDefinedToneScale()
}

export function getDefaultMusicScaleByTitle (title, defaultVal = defaultMusicScales.NotDefined) {
  for (const prop in defaultMusicScales) {
    if (defaultMusicScales[prop].title === title) {
      return defaultMusicScales[prop]
    }
  }
  return defaultVal
}
