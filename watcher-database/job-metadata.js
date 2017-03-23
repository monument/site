'use strict'

const path = require('path')
const debug = require('debug')('bmc:watcher:database')
const mkdirp = require('mkdirp')
const {readJsonFile, writeJsonFile} = require('./files')

module.exports.readJobMetadata = async function readJobMetadata(
  jobYear,
  jobName,
  {base} = {}
) {
  const filepath = makeMetadataFilePath(jobYear, jobName, base)
  return (await readJsonFile(filepath)) || {}
}

module.exports.writeJobMetadata = async function writeJobMetadata(
  jobYear,
  jobName,
  data,
  {base} = {}
) {
  const filepath = makeMetadataFilePath(jobYear, jobName, base)
  debug(`writing ${filepath}`)
  await mkdirp(path.dirname(filepath))
  return writeJsonFile(filepath, data)
}

function makeMetadataFilePath(jobYear, jobName, base) {
  return path.join(base, jobYear, jobName, 'index.json')
}
