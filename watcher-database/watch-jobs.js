'use strict'

const chokidar = require('chokidar')
const PQueue = require('p-queue')
const debug = require('debug')('bmc:watcher:database:images')
const { getInfoFromImage, checkEnvVars, isJpeg } = require('../lib')
const getMetadataFromJob = require('./get-metadata-from-job')
const {writeJobMetadata} = require('./job-metadata')

const {BMC_PHOTOS_DIR, BMC_METADATA_DIR} = checkEnvVars(
  'BMC_PHOTOS_DIR',
  'BMC_METADATA_DIR'
)

const queue = new PQueue({concurrency: 4})

const BASE = BMC_PHOTOS_DIR
const PATTERN = '**/*'
const GLOB = `${BASE}/${PATTERN}`

const watcher = chokidar.watch(GLOB, {
  ignored: /[\/\\]\./,
  awaitWriteFinish: true,
})
watcher.on('change', filepath => {
  debug('change', filepath)
  addFileToQueue(filepath)
})
watcher.on('add', filepath => {
  debug('add', filepath)
  addFileToQueue(filepath)
})
watcher.on('ready', () => {
  debug('ready')
})

async function addFileToQueue(filepath) {
  // only add jpegs to the queue
  if (!isJpeg(filepath)) {
    return
  }

  const {jobName, jobYear} = await getInfoFromImage(filepath, {root: BMC_METADATA_DIR})

  queue.add(async () => {
    const data = await getMetadataFromJob(jobYear, jobName, {
      photosBase: BMC_PHOTOS_DIR,
      metadataBase: BMC_METADATA_DIR,
    })
    return writeJobMetadata(jobYear, jobName, data, {base: BMC_METADATA_DIR})
  })
}
