const { createObjectTyping } = require('./type-check')
const { reviewObjectStructure, verifyObjectPaths } = require('./read-path')

module.exports = {
  createObjectTyping,
  reviewObjectStructure,
  verifyObjectPaths,
}