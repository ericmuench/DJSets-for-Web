import { Tone } from './Tone'

/**
* This class represents the Circle of Fifths with N-Harmonic Mixup
*/
class NHarmonicCircleOfFifths {
  constructor () {
    this.flatKeys = [new Tone('F'), new Tone('Bb'), new Tone('Eb'), new Tone('Ab'), new Tone('Db'), new Tone('Gb')]
    this.sharpKeys = [new Tone('G'), new Tone('D'), new Tone('A'), new Tone('E'), new Tone('B'), new Tone('F#')]
    this.neutralKeys = [new Tone('C')]
  }
}

export const defaultCircleOfFifths = new NHarmonicCircleOfFifths()
