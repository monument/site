'use strict'

const delay = require('delay')
const pify = require('pify')
const fs = pify(require('fs'))

module.exports.writeJsonFile = async function writeJsonFile(filepath, data) {
  const stringified = JSON.stringify(data, null, 2) + '\n'
  return fs.writeFile(filepath, stringified, 'utf-8')
}

module.exports.readJsonFile = async function readJsonFile(
  filepath,
  attempt = 1
) {
  let data
  try {
    data = await fs.readFile(filepath, 'utf-8')
  } catch (err) {
    err.fileName = filepath
    if (err.code === 'ENOENT') {
      data = null
    } else {
      throw err
    }
  }

  try {
    return JSON.parse(data)
  } catch (e) {
    try {
      if (attempt > 3) {
        throw e
      }
      await delay(500)
      return readJsonFile(filepath, attempt + 1)
    } catch (err) {
      console.log(filepath)
      console.log(Buffer.from(data))
      console.log(data.length)
      err.fileName = filepath
      throw err
    }
  }
}
