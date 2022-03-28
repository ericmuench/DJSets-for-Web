export class ConstructorError extends Error {
  constructor (className, details) {
    super(`Invalid Constructor call in ${className}. ${details}`)
  }
}

export class TypeMismatchError extends Error {
  constructor (expectedTypeName, actualTypeName) {
    super(`Type Mismatch. Expected type was ${expectedTypeName}. Actual type was ${actualTypeName}`)
  }
}

export class StringFormatError extends Error {
  constructor (str) {
    super(`String Format Error. Given string does match the required format. It was ${str}`)
  }
}
