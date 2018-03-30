# Patrick's Parser

### Use and Interface

The entirety of the path validation system is no more than 100 lines of code at the time of this writing. In the process of validation, we will end with an empty array if no keys are missing. If some expected keys ARE missing, then the result of the validation function will be an array containing the following details:

`
{ type: String,
  paths: Array<String>,
  name: String
}
`

### Object Explained:

- type: The type of validation to occur. At the onset of this functionality, the options are `one-of-many` (1 of multiple paths must be present) & `single` (the one path provided must be present)
- paths: The path(s) being checked against in validation. These follow identical syntax for Ramda's `R.path` fn. For both a single or a one-of-many validation, the params are provided are: `[ ['some', 'test', 'path'] ]`
- name: The field name (after parsing) of the path that failed validation.

### Use Example:

First, we construct the details of what we are validating:
- makeSinglePath: `(fieldName: String, pathList: Array<Array<String>>) => Array<Object>`
- makeOneOfManyPath: `(fieldName: String, pathList: Array<Array<String>>) => Array<Object>`

Then, we process the object and check it's keys against our list of required key details:
```
const headlinePath = [ 'headline' ]
const usernamePath = [ 'user', 'name' ]
const userIdPath = [ 'user', 'id' ]

function _translateAnObject (testDetails) {
  const associatedPaths = [
    makeSinglePath('fooKey', [ headlinePath ]),
    makeOneOfManyPath('userKey', [ usernamePath, userIdPath ]),
  ]

  const validatePresenceOfKeys = reviewObjectStructure(
    associatedPaths,
    testDetails,
  )

  if (validatePresenceOfKeys.length > 0) {
    console.error('Key validation error in::_translateAnObject: ', validatePresenceOfKeys)

    throw new Error('Object Keys Changed in ::_translateAnObject')
  }

  return R.applySpec({
    fooKey: R.path(headlinePath),
    userKey: R.either(R.path(usernamePath), R.path(userIdPath)),
  })(testDetails)
}
```