'use strict'
const path = require('path')

module.exports = function stripext(filename) {
  const ext = path.extname(filename)
  return path.basename(filename, ext)
}
