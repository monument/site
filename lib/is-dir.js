'use strict'

const fs = require('graceful-fs')

module.exports = function isDir(path) {
  try {
    return fs.statSync(path).isDirectory()
  } catch (err) {
    return false
  }
}
