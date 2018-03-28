const R = require('ramda')

// ----------------------------------------------------------
// ----- Test Params
// ----------------------------------------------------------
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