'use strict'

const pDebounce = require('p-debounce')
const debug = require('debug')('bmc:watcher:database')
const {writeJsonFile} = require('./files')

module.exports = pDebounce(writeDatabase, 1000)

function writeDatabase(db, toFile) {
  debug(
    `wrote database with ${db.size} ${db.size === 1 ? 'entry' : 'entries'} to "${toFile}"`
  )
  const objectified = Array.from(db.values())
  return writeJsonFile(toFile, objectified).catch(console.error)
}
