#!/usr/bin/env node
'use strict'

const chokidar = require('chokidar')
const PQueue = require('p-queue')
const mkdirp = require('mkdirp')
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

const queue = new PQueue({concurrency: 1})

const BASE = BMC_PHOTOS_DIR
const PATTERN = '**/*'
const GLOB = `${BASE}/${PATTERN}`

const watcher = chokidar.watch(GLOB, {ignored: /[\/\\]\./})
let isReady = false
watcher.on('change', filepath => {
  debug('change', filepath)
  addFileToQueue(filepath, {force: true})
})
watcher.on('add', filepath => {
  debug('add', filepath)
  addFileToQueue(filepath, {force: isReady})
})
watcher.on('ready', () => {
  debug('ready')
  isReady = true
})

function addFileToQueue(filepath, {force} = {}) {
  // only add jpegs to the queue
  if (!isJpeg(filepath)) {
    return
  }

  queue.add(async () => {
    const {baseFilename, destDir} = await getInfoFromImage(filepath, {
      useDirName: true,
      root: BMC_THUMBNAILS_DIR,
    })

    await mkdirp(destDir)

    // generateThumbnailsFor is a generator that
    // returns functions which return promises
    const gen = generateThumbnailsFor(filepath, {
      intoDir: destDir,
      basename: baseFilename,
      force: force,
    })

    for (const futurePromise of gen) {
      queue.add(futurePromise)
    }
  })
}
