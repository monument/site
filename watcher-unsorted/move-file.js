'use strict'

const fs = require('graceful-fs')
const path = require('path')
const pify = require('pify')
const mkdirp = pify(require('mkdirp'))
const rename = pify(fs.rename)
const debug = require('debug')('bmc:watcher:unsorted')

module.exports = async function moveFile(fromFile, toFile) {
  const destDir = path.dirname(toFile)

  debug(`moving ${fromFile} to ${toFile}`)

  try {
    await mkdirp(destDir)
    await rename(fromFile, toFile)
  } catch (err) {
    console.error(err)
  }
}
