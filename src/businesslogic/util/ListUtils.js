export function groupBy (list, groupFunc) {
  if (list instanceof Array && groupFunc instanceof Function) {
    const grouped = {}
    list.forEach(it => {
      const groupKey = `${groupFunc(it)}`
      if (grouped[groupKey] instanceof Array) {
        grouped[groupKey].push(it)
      } else {
        grouped[groupKey] = [it]
      }
    })
    return grouped
  } else {
    return { notGrouped: list }
  }
}

export function moveElement (list, fromIndex, toIndex) {
  if (!(list instanceof Array && Number.isInteger(fromIndex) && Number.isInteger(toIndex))) {
    console.warn('Move failed because of type mismatch')
    return list
  }

  const resultList = [...list]
  const fromElement = resultList.splice(fromIndex, 1)[0]
  resultList.splice(toIndex, 0, fromElement)
  return resultList
}
