const R = require('ramda')
const assert = require('assert')
const {
  makeOneOfManyPath,
  makeSinglePath,
  reviewObjectStructure,
} = require('../read-path.js')

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
  [ flatFooPath, goodNestedPath ]
)

const oneOfManyTestMixed = makeOneOfManyPath(
  'oneOfManyTestMixed',
  [ flatFooPath, goodNestedPath, badNestedPath ],
)

// --- Combined Paths to Test
const allPassingOneOfManyPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]
const allFailingOneOfManyPaths = [ oneOfManyTestBad ]
const mixedOneOfManyPaths = [ oneOfManyTestMixed, oneOfManyTestBad ]

// ----------------------------------------------------------
// ----- Complex Test Params
// ----------------------------------------------------------
// -- Complex Objects
const complexObject = {
  arrayKey: [],
  nestedObj: { yes: 1 },
  reallyNestedObj: {
    moreContent: { yetMore: null }
  },
  numberKey: 1,
  stringKey: 'Some String',
  nullKey: null,
}

// -- Complex Nested Paths
const goodComplexNestedPath = [ 'nestedObj', 'someKey' ]
const goodComplexNestedPathTwo = [ 'reallyNestedObj', 'moreContent' ]
const goodComplexNestedPathThree = [ 'reallyNestedObj', 'moreContent', 'yetMore' ]

const badComplexNestedPath = [ 'pain', 'train' ]
const badComplexNestedPathTwo = [ 'the', 'doctor', 'who' ]
const badComplexNestedPathThree = [ 'the', 'doctor', 'who' ]

// -- Complex Flat Paths
const goodArrayPath = [ 'arrayKey' ]
const goodNumberPath = [ 'numberKey' ]
const goodStringPath = [ 'stringKey' ]
const goodNullPath = [ 'nullKey' ]

const badTerriblePath = [ 'terrible' ]
const badTerryPath = [ 'terry' ]
const badTatePath = [ 'tate' ]
const badOfficePath = [ 'office' ]

// ----------------------------------------------------------
// ----- Complex Test Data
// ----------------------------------------------------------
// --- Single Test Paths
const singleComplexPathGood = makeSinglePath('singleComplexPathGood', [ goodNestedPath ])
const singleComplexPathBad = makeSinglePath('singleComplexPathBad', [ badNestedPath ])

// --- One of Many Test Paths
const oneOfManyAllFlatBad = makeOneOfManyPath(
  'oneOfManyAllFlatBad',
  [ badTerriblePath, badTerryPath, badTatePath, badOfficePath ]
)
const oneOfManyAllNestedBad = makeOneOfManyPath(
  'oneOfManyAllNestedBad',
  [ badComplexNestedPath, badComplexNestedPathTwo, badComplexNestedPathThree ]
)
const oneOfManyMixedTypeBad = makeOneOfManyPath(
  'oneOfManyMixedTypeBad',
  [ badTerriblePath, badComplexNestedPath, badTerryPath, badComplexNestedPathTwo ]
)


const oneOfManyAllFlatGood = makeOneOfManyPath(
  'oneOfManyAllFlatGood',
  [ goodArrayPath, goodNumberPath, goodStringPath, goodNullPath ]
)
const oneOfManyAllNestedGood = makeOneOfManyPath(
  'oneOfManyAllNestedGood',
  [ goodComplexNestedPath, goodComplexNestedPathTwo, goodComplexNestedPathThree ],
)
const oneOfManyMixedTypeGood = makeOneOfManyPath(
  'oneOfManyMixedTypeGood',
  [ goodArrayPath, goodComplexNestedPath, goodStringPath, goodComplexNestedPathTwo ]
)


const oneOfManyAllFlatMixed = makeOneOfManyPath(
  'oneOfManyAllFlatMixed',
  [ goodArrayPath, badTatePath, goodStringPath, badOfficePath ]
)
const oneOfManyAllNestedMixed = makeOneOfManyPath(
  'oneOfManyAllNestedMixed',
  [ goodComplexNestedPath, badComplexNestedPath, goodComplexNestedPathThree ],
)
const oneOfManyMixedTypeMixed = makeOneOfManyPath(
  'oneOfManyMixedTypeMixed',
  [ goodNumberPath, goodComplexNestedPath, badTatePath, badComplexNestedPathThree ]
)

// --- Combined Paths to Test
const passingNestedPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]
const failingNestedPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]
const mixedNestedPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]

const passingFlatPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]
const failingFlatPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]
const mixedFlatPaths = [ oneOfManyTestGood, oneOfManyTestMixed ]

const passingBothPathTypes = []
const failingBothPathTypes = []
const mixedBothPathTypes = []

// ----------------------------------------------------------
// ----- Formal Test Cases
// ----------------------------------------------------------
describe('Verify Object Shape', function() {

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

  describe('#reviewObjectStructure() - Complex Object', function() {

    it('A valid object should return an empty array', function() {
      const validationResults = reviewObjectStructure(
        allPassingOneOfManyPaths,
        complexObject
      )

      assert.deepEqual(validationResults.length, 0)
    })

    it('An invalid object missing paths should return an array with error details', function() {
      const validationResults = reviewObjectStructure(
        allFailingOneOfManyPaths,
        complexObject
      )

      assert.deepEqual(validationResults, [ oneOfManyTestBad ])
    })

    it('An partially valid object missing some paths should return an array with specific error details', function() {
      const validationResults = reviewObjectStructure(
        mixedOneOfManyPaths,
        complexObject
      )

      assert.deepEqual(validationResults, [ oneOfManyTestBad ])
    })

  })

  // describe('#indexOf()', function() {
  //   it('A valid object with flat keys should return an empty array', function() {
  //     assert.deepEqual(validation.length, 0)
  //   })
  // })

})