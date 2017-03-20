'use strict'

const path = require('path')

const jpeg = /\.jpe?g$/i

module.exports = function isJpeg(filepath) {
  return jpeg.test(path.extname(filepath))
}
