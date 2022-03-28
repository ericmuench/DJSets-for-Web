export function isNotEmptyOrBlank (str) {
  return !(/^\s*$/.test(str))
}
