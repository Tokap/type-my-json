function isObject (val) {
  return typeof val === 'object' && !Array.isArray(val) && val !== null
}

function isString (val) {
  return typeof val === 'string'
}

function isNumber (val) {
  return typeof val === 'number'
}

function isBool (val) {
  return typeof val === 'boolean'
}

function isArray (val) {
  return Array.isArray(val)
}
function isFunction (val) {
  return typeof val === 'function'
}

function determineType (val) {
  if (val === null) return 'Nullable'
  if (isObject(val)) return 'Object'
  if (isNumber(val)) return 'Number'
  if (isString(val)) return 'String'
  if (isBool(val)) return 'Boolean'
  if (isFunction(val)) return 'Function'

  // Consider searching deeper here
  if (isArray(val)) {
    if (val.length === 0) return 'Array<*>'

    const arrayContentType = determineType(val[0])
    return `Array<${arrayContentType}>`
  }

  return 'Unknown Type'
}

module.exports = {
  determineType,
  isObject,
}