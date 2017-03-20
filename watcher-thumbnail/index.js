#!/usr/bin/env node
'use strict'

const chokidar = require('chokidar')
const PQueue = require('p-queue')
const debug = require('debug')('bmc:watcher:thumbnail')
const generateThumbnailsFor = require('./generate-thumbnails')
const {
  getInfoFromImage,
  checkEnvVars,
  isJpeg,
} = require('../lib')

const {
  BMC_PHOTOS_DIR,
  BMC_THUMBNAILS_DIR,
} = checkEnvVars('BMC_PHOTOS_DIR', 'BMC_THUMBNAILS_DIR')

const queue = new PQueue({concurrency: 4})

const BASE = BMC_PHOTOS_DIR
const PATTERN = '**/*'
const GLOB = `${BASE}/${PATTERN}`

const watcher = chokidar.watch(GLOB, {ignored: /[\/\\]\./})
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

  const {baseFilename, destDir} = await getInfoFromImage(filepath, {
    root: BMC_THUMBNAILS_DIR,
  })

  // generateThumbnailsFor is a generator that
  // returns functions which return promises
  const gen = generateThumbnailsFor(filepath, {
    intoDir: destDir,
    basename: baseFilename,
  })

  for (const futurePromise of gen) {
    queue.add(futurePromise)
  }
}
