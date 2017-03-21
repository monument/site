'use strict'

const debug = require('debug')('bmc:watcher:database')
const {writeJsonFile} = require('./files')

module.exports = function throttledWriteDatabase(db, toFile) {
  writeDatabase(db, toFile)
}

function writeDatabase(db, toFile) {
  debug(
    `wrote database with ${db.size} ${db.size === 1 ? 'entry' : 'entries'} to "${toFile}"`
  )
  const objectified = Array.from(db.values())
  return writeJsonFile(toFile, objectified).catch(console.error)
}
