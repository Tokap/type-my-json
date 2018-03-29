// ----------------------------------------------------------
// ----- Simple Test Params
// ----------------------------------------------------------
// -- Test Objects
const simpleObject = {
  foo: 'bar',
  bah: 'baz',
  something: null,
  myObj: { someKey: 'thing' },
  yourObj: { anotherKey: 41 },
}

// -- Simple Nested Paths
const goodNestedPath = [ 'myObj', 'someKey' ]
const goodNestedPathTwo = [ 'yourObj', 'anotherKey' ]

const badNestedPath = [ 'doop', 'someKey' ]
const badNestedPathTwo = [ 'bah', 'someKey' ]

// -- Simple Flat Paths
const goodFooPath = [ 'foo' ]
const goodSomethingPath = [ 'something' ]
const badTerrPath = [ 'terr' ]

// ----------------------------------------------------------
// ----- Simple Test Data
// ----------------------------------------------------------
// --- Single Test Paths
const singlePathGood = makeSinglePath('singlePathGood', [ goodNestedPath ])
const singlePathBad = makeSinglePath('singlePathBad', [ badNestedPath ])

// --- One of Many Test Paths
const oneOfManyTestBad = makeOneOfManyPath(
  'oneOfManyTestBad',
  [ badNestedPathTwo, badNestedPath ]
)

const oneOfManyTestGood = makeOneOfManyPath(
  'oneOfManyTestGood',
  [ goodFooPath, goodNestedPath ]
)

const oneOfManyTestMixed = makeOneOfManyPath(
  'oneOfManyTestMixed',
  [ goodFooPath, goodNestedPath, badNestedPath ],
)

// --- Combined Paths to Test
const allPassingOneOfManyPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]
const allFailingOneOfManyPaths = [ oneOfManyTestBad ]
const mixedOneOfManyPaths = [ oneOfManyTestMixed, oneOfManyTestBad ]

// ---- Simple Object Tests
describe('#reviewObjectStructure() - Simple Object', function() {

  it('A valid object should return an empty array', function() {
    const validationResults = reviewObjectStructure(
      allPassingOneOfManyPaths,
      simpleObject
    )

    assert.deepEqual(validationResults.length, 0)
  })

  it('An invalid object missing paths should return an array with error details', function() {
    const validationResults = reviewObjectStructure(
      allFailingOneOfManyPaths,
      simpleObject
    )

    assert.deepEqual(validationResults, [ oneOfManyTestBad ])
  })

  it('An partially valid object missing some paths should return an array with specific error details', function() {
    const validationResults = reviewObjectStructure(
      mixedOneOfManyPaths,
      simpleObject
    )

    assert.deepEqual(validationResults, [ oneOfManyTestBad ])
  })

})