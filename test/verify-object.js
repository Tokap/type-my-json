const R = require('ramda')
const assert = require('assert')

const {
  makeOneOfManyPath,
  makeSinglePath,
  reviewObjectStructure,
} = require('../read-path.js')

// ----------------------------------------------------------
// ----- Test Params
// ----------------------------------------------------------
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
// ----- Test Data
// ----------------------------------------------------------
// --- Single Test Paths
const singleArrayPathGood = makeSinglePath('singleArrayPathGood', [ goodArrayPath ])
const singleNumberPathGood = makeSinglePath('singleNumberPathGood', [ goodNumberPath ])
const singleNullPathGood = makeSinglePath('singleNullPathGood', [ goodNullPath ])

const singleTerriblePathBad = makeSinglePath('singleTerriblePathBad', [ badTerriblePath ])
const singleTerryPathBad = makeSinglePath('singleTerryPathBad', [ badTerryPath ])
const singleTatePathBad = makeSinglePath('singleTatePathBad', [ badTatePath ])

// --- One of Many Test Paths (Bad)
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

// --- One of Many Test Paths (Good)
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

// --- One of Many Test Paths (Mixed)
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
const passingMultiPaths = [ oneOfManyAllFlatGood, oneOfManyAllNestedGood, oneOfManyMixedTypeGood ]
const failingMultiPaths = [ oneOfManyAllFlatBad, oneOfManyAllNestedBad, oneOfManyMixedTypeBad ]
const mixedMultiPaths = [ oneOfManyAllFlatGood, oneOfManyAllNestedGood, oneOfManyAllFlatBad, oneOfManyMixedTypeMixed ]

const passingSinglePaths = [ singleArrayPathGood, singleNumberPathGood, singleNullPathGood ]
const failingSinglePaths = [ singleTerriblePathBad, singleTerryPathBad, singleTatePathBad ]
const mixedSinglePaths = [ singleNullPathGood, singleTerryPathBad, singleTerryPathBad ]

const passingBothPathTypes = [ singleArrayPathGood, oneOfManyAllFlatGood, oneOfManyMixedTypeGood, singleNumberPathGood ]
const failingBothPathTypes = [ oneOfManyAllFlatBad, singleTerriblePathBad, singleTatePathBad, oneOfManyMixedTypeBad ]
const mixedBothPathTypes = [ oneOfManyAllFlatGood, singleTerryPathBad, oneOfManyMixedTypeBad, singleNullPathGood ]

// ----------------------------------------------------------
// ----- Formal Test Cases
// ----------------------------------------------------------
describe('Verify Object Shape & Keys', function() {

  describe('#reviewObjectStructure() - Complex Object', function() {

    // --- Good Fields Tests
    it('A valid object should return an empty array for multi-path options', function() {
      const validationResults = reviewObjectStructure(
        passingMultiPaths,
        complexObject
      )

      assert.deepEqual(validationResults.length, 0)
    })

    it('A valid object should return an empty array for single-path options', function() {
      const validationResults = reviewObjectStructure(
        passingSinglePaths,
        complexObject
      )

      assert.deepEqual(validationResults.length, 0)
    })

    it('A valid object should return an empty array for mixed-path options', function() {
      const validationResults = reviewObjectStructure(
        passingBothPathTypes,
        complexObject
      )

      assert.deepEqual(validationResults.length, 0)
    })

    // --- Bad Fields Tests
    it('An invalid object missing multi-paths should return an array with error details', function() {
      const validationResults = reviewObjectStructure(
        failingMultiPaths,
        complexObject
      )

      assert.deepEqual(validationResults, failingMultiPaths)
    })

    it('An invalid object missing single-paths should return an array with error details', function() {
      const validationResults = reviewObjectStructure(
        failingSinglePaths,
        complexObject
      )

      assert.deepEqual(validationResults, failingSinglePaths)
    })

    it('An invalid object missing mixed-paths should return an array with error details', function() {
      const validationResults = reviewObjectStructure(
        failingBothPathTypes,
        complexObject
      )

      assert.deepEqual(validationResults, failingBothPathTypes)
    })


    // --- Good & Bad Fields Tests
    it('A partially valid object w/ multi-paths should return an array with specific error details', function() {
      const validationResults = reviewObjectStructure(
        mixedMultiPaths,
        complexObject
      )

      assert.deepEqual(validationResults, [ oneOfManyAllFlatBad ])
    })

    it('A partially valid object w/ single-paths should return an array with specific error details', function() {
      const validationResults = reviewObjectStructure(
        mixedSinglePaths,
        complexObject
      )

      assert.deepEqual(validationResults, [ singleTerryPathBad, singleTerryPathBad ])
    })

    it('A partially valid object w/ mixed-paths should return an array with specific error details', function() {
      const validationResults = reviewObjectStructure(
        mixedBothPathTypes,
        complexObject
      )

      assert.deepEqual(validationResults, [ singleTerryPathBad, oneOfManyMixedTypeBad ])
    })

  })

})