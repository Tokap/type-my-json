const { isObject, determineType} = require('./type-check')

function createObjectTyping (startObject) {
  let ourObject = {}

  Object.keys(startObject).map(key => {
    const currVal = startObject[key]

    if (isObject(currVal)) {
      return ourObject[key] = createObjectTyping(currVal)
    }

    ourObject[key] = determineType(currVal)
  })

  return ourObject
}