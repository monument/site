#!/usr/bin/env node
'use strict'

const chokidar = require('chokidar')
const PQueue = require('p-queue')
const path = require('path')
const debug = require('debug')('bmc:watcher:unsorted')
const moveFile = require('./move-file')
const {
  getInfoFromImage,
  checkEnvVars,
  isJpeg,
} = require('../lib')

const {
  BMC_PHOTOS_DIR,
  BMC_PHOTOS_UNSORTED_DIR,
} = checkEnvVars('BMC_PHOTOS_UNSORTED_DIR', 'BMC_PHOTOS_DIR')

const queue = new PQueue({concurrency: 4})

const BASE = BMC_PHOTOS_UNSORTED_DIR
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

function addFileToQueue(filepath) {
  // only add jpegs to the queue
  if (!isJpeg(filepath)) {
    return
  }

  queue.add(async () => {
    const {destDir, filename} = await getInfoFromImage(filepath, {
      root: BMC_PHOTOS_DIR,
    })

    const destFile = path.join(destDir, filename)
    return moveFile(filepath, destFile)
  })
}
