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

// "type" can be either single, one-of-many
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
// ----- Actual Functionality
// ----------------------------------------------------------
function errorDetailsOrNull (arr, details) {
  return arr.length > 0 ? details : null
}

// This FN Will work correctly for only 1 state of an object
function verifyObjectShape (paths, obj) {
  const pathFailures = paths.reduce((badPaths, path) => {
    const pathResult = R.path(path, obj)

    if (pathResult === undefined) badPaths.push(path)

    return badPaths
  }, [])

  return pathFailures
}


function verifySinglePath (pathContainer, obj) {
  if (pathContainer.length === 0) return []

  const pathResult = R.path(pathContainer[0], obj)

  if (pathResult === undefined) return pathContainer[0]

  return []
}

function verifyMultiPath (pathContainers, obj) {
  const pathResults = pathContainers.reduce((badPaths, path) => {
    const pathResult = R.path(path, obj)

    // If Ramda returns an undefined for a path, it isn't there
    if (pathResult === undefined) {
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
    return errorDetailsOrNull(
      verifySinglePath(fieldDetails.paths, obj),
      fieldDetails
    )
  }

  if (fieldDetails.type === 'one-of-many') {
    return errorDetailsOrNull(
      verifyMultiPath(fieldDetails.paths, obj),
      fieldDetails
    )
  }

  // Could throw
  console.error('Error: We received an unknown field type')
  return null
}


function reviewObjectStructure (fieldList, obj) {
  return fieldList
    .map(determineStrategy.bind(null, obj))
    .filter(arr => arr != null)
}

function processErrorReturns (verificationArr) {
  if (verificationArr.length === 0) return null

  return verificationArr.forEach((failure) => {
    const { paths, name, type } = failure
    const fieldError = `The following Path(s) failed: `
    const generalError = `Error when verifying Field: ${name} (${type}) \n${fieldError}`

    console.error(generalError, paths)
  })
}

function verifyObjectPaths (pathObjects, objects) {
  return processErrorReturns(
    reviewObjectStructure([pathObject, badPathObject, oneOfManyTest], testObject)
  )
}

const verification = reviewObjectStructure([pathObject, badPathObject, oneOfManyTest], testObject)

processErrorReturns(verification)
