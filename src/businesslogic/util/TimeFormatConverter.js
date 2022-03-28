import { isValidDurationString } from './Validators'
import { StringFormatError } from './ErrorManagement'

export class TimeFormatConverter {
  convertToTimeMillis (durationString) {
    if (typeof durationString !== 'string') {
      throw new TypeError('string', typeof durationString)
    }

    if (!isValidDurationString(durationString)) {
      throw new StringFormatError(durationString)
    }

    const timeParams = durationString.split(':')
    const minutes = parseInt(timeParams[0])
    const seconds = parseInt(timeParams[1])

    return 1000 * seconds + 60000 * minutes
  }

  convertToDurationString (timeMillis) {
    if (!(Number.isInteger(timeMillis))) {
      throw new TypeError('number (Integer)', typeof timeMillis)
    }

    if (timeMillis < 0) {
      throw new Error('Time Conversion impossible. Timemillis is smaller than 0!')
    }

    const allMinutes = timeMillis / 60000
    const absoluteMinutes = Math.trunc(allMinutes)
    const relativeSeconds = allMinutes - absoluteMinutes
    const absoluteSeconds = Math.round(relativeSeconds * 60)

    return `${absoluteMinutes < 10 ? '0' : ''}${absoluteMinutes}:${absoluteSeconds < 10 ? '0' : ''}${absoluteSeconds}`
  }
}
