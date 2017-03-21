'use strict'

const uniqBy = require('lodash/uniqBy')
const delay = require('delay')
const {readJsonFile, writeJsonFile} = require('./files')

module.exports = async function processFileForDatabase(filepath, dbfile) {
  await delay(500)
  const data = await readJsonFile(filepath)
  return updateDatabase(data.title, data.year, data, dbfile)
}

async function updateDatabase(jobName, jobYear, data, dbfile) {
  let db
  try {
    db = (await readJsonFile(dbfile)) || []
  } catch (err) {
    db = []
  }

  if (db.find(entry => entry.id === data.id)) {
    db = db.filter(entry => entry.id !== data.id).concat(data)
  } else {
    db = uniqBy([...db, data], entry => `${entry.date} ${entry.title}`)
  }

  return writeJsonFile(dbfile, db)
}
