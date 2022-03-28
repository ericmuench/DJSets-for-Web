/**
* This class represents a Tone that can be used in Music or played on a Piano.
* IMPORTANT: The Tone's title has to conform to a Music-Theory-Conform Syntax (e.g. D! is not allowed, but D# is)
*/
export class Tone {
  constructor (title) {
    if (/^[A-G][b#]?$/.test(title)) {
      this.title = title
    } else {
      throw new Error(`Invalid Constructor call in Tone. The created Tone does not conform a Music-Theory-Conform Syntax. Title was ${title}`)
    }
  }

  getKeyBaseString () {
    return this.title.charAt(0)
  }

  isSharp () {
    return /^[A-G]#$/.test(this.title)
  }

  isFlat () {
    return /^[A-G]b$/.test(this.title)
  }

  isFlatOrSharp () {
    return this.isFlat() || this.isSharp()
  }

  nextSemiTone () {
    if (this.isFlat()) {
      return new Tone(this.getKeyBaseString())
    }

    let newToneTitle = null
    if (this.title === 'G#') {
      newToneTitle = 'A'
    } else if (this.title === 'B#' || this.title === 'E#') {
      return new Tone(this.getKeyBaseString()).nextSemiTone().nextSemiTone()
    } else if (this.title === 'B' || this.title === 'E' || this.isSharp()) {
      newToneTitle = String.fromCharCode(this.title.charCodeAt(0) + 1)
    } else {
      newToneTitle = `${this.getKeyBaseString()}#`
    }

    return new Tone(newToneTitle)
  }

  nextTone () {
    return this.nextSemiTone().nextSemiTone()
  }

  previousTone () {
    return this.previousSemiTone().previousSemiTone()
  }

  previousSemiTone () {
    if (this.isSharp()) {
      return new Tone(this.getKeyBaseString())
    }

    let newToneTitle = null
    if (this.title === 'Ab') {
      newToneTitle = 'G'
    } else if (this.title === 'Cb' || this.title === 'Fb') {
      return new Tone(this.getKeyBaseString()).previousSemiTone().previousSemiTone()
    } else if (this.title === 'C' || this.title === 'F' || this.isFlat()) {
      newToneTitle = String.fromCharCode(this.title.charCodeAt(0) - 1)
    } else {
      newToneTitle = `${this.getKeyBaseString()}b`
    }

    return new Tone(newToneTitle)
  }

  flatToSharp () {
    return this.previousSemiTone().nextSemiTone()
  }

  sharpToFlat () {
    return this.nextSemiTone().previousSemiTone()
  }

  equals (otherTone) {
    return this.exactEquals(otherTone) || this.sharpToFlat().title === otherTone.sharpToFlat().title
  }

  exactEquals (otherTone) {
    if (!(otherTone instanceof Tone)) {
      return false
    }
    return this.title === otherTone.title
  }
}
