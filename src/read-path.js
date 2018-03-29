const R = require('ramda')

// ----------------------------------------------------------
// ----- Verification Functionality
// ----------------------------------------------------------
function errorDetailsOrNull (arr, details) {
  return arr.length > 0 ? details : null
}

function verifySinglePath (pathContainer, obj) {
  // Return empty arr on no path being provided. It's technically valid.
  if (pathContainer.length === 0) return []
  // If we got back undefined, the path is missing & we return details
  if (R.path(pathContainer[0], obj) === undefined) return pathContainer[0]
  // Otherwise, return empty arr because we found the desired path.
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
  // If any path was valid, return empty arr. Else, return field error details
  return hasValidPath ? [] : pathResults
}

function validatePathByStrategy (obj, fieldDetails) {
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
    .map(validatePathByStrategy.bind(null, obj))
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

function verifyObjectPaths (pathObjects, obj) {
  return processErrorReturns(
    reviewObjectStructure(pathObjects, obj)
  )
}

// ----------------------------------------------------------
// ----- Support Functionality
// ----------------------------------------------------------
function makePathObject (type, fieldName, pathArray) {
  return { type, paths: pathArray, name: fieldName }
}

function makeOneOfManyPath (fieldName, pathArray) {
  return makePathObject('one-of-many', fieldName, pathArray)
}

function makeSinglePath (fieldName, pathArray) {
  return makePathObject('single', fieldName, pathArray)
}


module.exports = {
  // No Inherent Error Handling -> Returns Broken Paths in Array
  reviewObjectStructure,

  // With Default Error Output
  verifyObjectPaths,

  // Make Your Path Object:
  makeOneOfManyPath,
  makeSinglePath,
}
