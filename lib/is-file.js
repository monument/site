'use strict'

const fs = require('graceful-fs')

module.exports = function isFile(path) {
  try {
    return fs.statSync(path).isFile()
  } catch (err) {
    return false
  }
}
