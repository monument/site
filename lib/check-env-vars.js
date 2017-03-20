'use strict'

const isDir = require('./is-dir')
const isFile = require('./is-file')
const isString = require('lodash/isString')

module.exports = function checkEnvVars(...names) {
  let error = false
  const retvals = {}

  for (let key of names) {
    let mode = 'directory'
    if (!isString(key)) {
      mode = key.mode
      key = key.key
    }

    if (!(key in process.env)) {
      console.error(`$${key} must be set`)
      error = true
    }

    const value = process.env[key]
    const checker = mode === 'directory'
      ? isDir
      : mode === 'file'
      ? isFile
      : null
    if (!checker) {
      throw new Error(`mode must be file|directory, not "${mode}"`)
    }
    if (!checker(value)) {
      console.error(`$${key} must be a ${mode}`)
      console.error(`$${key} is currently set to "${value}"`)
      error = true
    }

    retvals[key] = value
  }

  if (error) {
    process.exit(1)
  }

  return retvals
}
