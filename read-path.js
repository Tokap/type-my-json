// ----------------------------------------------------------
// ----- Test Params
// ----------------------------------------------------------
const R = require('ramda')

const testObject = {
  foo: 'bar',
  bah: 'baz',
  thing: null,
  myObj: { someKey: 'thing' }
}

const testPath = [ 'myObj', 'someKey' ]
const badPath = [ 'doop', 'someKey' ]
const morePath = [ 'foo' ]
const yetMorePath = [ 'terr' ]

// Can we construct what a path is differently? How can we check?

// "type" can be either single, optional, one-of-many
// "paths" will be handled differently for different types
// Consider a "name" category as well
const pathObject = {
  type: 'single',
  paths: [ testPath ],
  name: 'internalFieldName'
}

const badPathObject = {
  type: 'single',
  paths: [ badPath ],
  name: 'internalFieldName2'
}

const oneOfManyTest = {
  type: 'one-of-many',
  paths: [ [ 'bah', 'someKey' ], badPath ],
  name: 'internalFieldName3'
}
// ----------------------------------------------------------
// ----- Deprecated Functionality
// ----------------------------------------------------------

// This FN Will work correctly for only 1 state of an object
function verifyObjectShape (paths, obj) {
  const pathFailures = paths.reduce((badPaths, path) => {
    const pathResult = R.path(path, obj)

    if (pathResult === undefined) badPaths.push(path)

    return badPaths
  }, [])

  return pathFailures
}

// ----------------------------------------------------------
// ----- Actual Functionality
// ----------------------------------------------------------
function populatedArrayOrNull (arr) {
  return arr.length > 0 ? arr : null
}

function verifySinglePath (pathContainer, obj) {
  // If we got an empty path, return empty result as it technically passes
  if (pathContainer.length === 0) return []
  // If we got an undefined result, return the path as a failure case
  if (R.path(pathContainer[0], obj) === undefined) return pathContainer[0]
  // Otherwise, return empty result as the path exists
  return []
}

function verifyMultiPath (pathContainers, obj) {
  const pathResults = pathContainers.reduce((badPaths, path) => {
    // If Ramda returns an undefined for a path, it isn't there
    if (R.path(path, obj) === undefined) {
      badPaths.push(path)
      return badPaths
    }
    // Otherwise, verify one of the requested paths is present
    badPaths.push(true)
    return badPaths
  }, [])

  const hasValidPath = pathResults.includes(true)

  return hasValidPath ? [] : pathResults
}

// At this point, do a check to see if contents.
// If we have contents, return full fieldDetails
// Otherwise, return null or true or something
function determineStrategy (obj, fieldDetails) {
  if (fieldDetails.type === 'single') {
    const verificationResult = verifySinglePath(fieldDetails.paths, obj)
    console.log('Verification Result: ', verificationResult)

    return populatedArrayOrNull(verificationResult)
  }

  if (fieldDetails.type === 'one-of-many') {
    const verificationResult =  verifyMultiPath(fieldDetails.paths, obj)

    return populatedArrayOrNull(verificationResult)
  }

  if (fieldDetails.type === 'optional') {}

  // Could throw
  console.error('Error: We received an unknown field type')
  return null
}


function reviewObjectStructure (fieldList, obj) {
  return fieldList
    .map(determineStrategy.bind(null, obj))
    .filter(arr => arr != null)
}

reviewObjectStructure([pathObject, badPathObject, oneOfManyTest], testObject)

