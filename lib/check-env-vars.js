'use strict'

const isDir = require('./is-dir')

module.exports = function checkEnvVars(...names) {
  let error = false
  const retvals = {}

  for (const key of names) {
    if (!(key in process.env)) {
      console.error(`$${key} must be set`)
      error = true
    }

    const value = process.env[key]
    if (!isDir(value)) {
      console.error(`$${key} must be a directory`)
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
