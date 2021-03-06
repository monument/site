#!/usr/bin/env node
'use strict'

process.on('unhandledRejection', function(reason, p) {
  console.error('Unhandled rejection in', p)
  console.error('Reason:', reason)
})

const chokidar = require('chokidar')
const PQueue = require('p-queue')
const debug = require('debug')('bmc:watcher:database')
const {getInfoFromImage, checkEnvVars, isJpeg} = require('../lib')
const getMetadataFromJob = require('./get-metadata-from-job')
const {writeJobMetadata} = require('./job-metadata')
const db = require('./db')
const writeDatabase = require('./write-database')

const {
  BMC_PHOTOS_DIR,
  BMC_METADATA_DIR,
  BMC_DATABASE_FILE,
} = checkEnvVars('BMC_PHOTOS_DIR', 'BMC_METADATA_DIR', {
  key: 'BMC_DATABASE_FILE',
  mode: 'file',
})

const queue = new PQueue({concurrency: 1})

const BASE = BMC_PHOTOS_DIR
const PATTERN = '**/*'
const GLOB = `${BASE}/${PATTERN}`

const watcher = chokidar.watch(GLOB, {
  ignored: /[\/\\]\./,
  awaitWriteFinish: true,
})
watcher.on('ready', () => debug('ready'))
watcher.on('add', filepath => addFileToQueue(filepath, 'add'))
watcher.on('change', filepath => addFileToQueue(filepath, 'change'))
watcher.on('unlink', filepath => addFileToQueue(filepath, 'unlink'))

function addFileToQueue(filepath, mode) {
  debug(mode, filepath)

  // only add jpegs to the queue
  if (!isJpeg(filepath)) {
    return
  }

  queue.add(async () => {
    const {jobName, jobYear} = await getInfoFromImage(filepath, {
      useDirName: true,
      root: BMC_METADATA_DIR,
    })

    const data = await getMetadataFromJob(jobYear, jobName, {
      photosBase: BMC_PHOTOS_DIR,
      metadataBase: BMC_METADATA_DIR,
    })

    if (mode === 'add') {
      db.set(data.id, data)
    } else if (mode === 'change') {
      db.set(data.id, data)
    } else if (mode === 'unlink') {
      db.remove(data.id)
    }

    writeDatabase(db, BMC_DATABASE_FILE)

    return writeJobMetadata(jobYear, jobName, data, {
      base: BMC_METADATA_DIR,
    })
  })
}
