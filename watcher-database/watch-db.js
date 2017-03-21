'use strict'

const chokidar = require('chokidar')
const PQueue = require('p-queue')
const debug = require('debug')('bmc:watcher:database:data')
const { checkEnvVars } = require('../lib')
const processFileForDatabase = require('./write-to-database')

const { BMC_METADATA_DIR, BMC_DATABASE_FILE } = checkEnvVars(
  'BMC_METADATA_DIR',
  {key: 'BMC_DATABASE_FILE', mode: 'file'}
)

const queue = new PQueue({concurrency: 1})

const BASE = BMC_METADATA_DIR
const PATTERN = '**/*'
const GLOB = `${BASE}/${PATTERN}`

const dbwatcher = chokidar.watch(GLOB, {
  ignored: /[\/\\]\./,
  awaitWriteFinish: true,
})
// dbwatcher.on('change', filepath => {
//   debug('change', filepath)
//   queue.add(() => processFileForDatabase(filepath, BMC_DATABASE_FILE))
// })
dbwatcher.on('add', filepath => {
  debug('add', filepath)
  queue.add(() => processFileForDatabase(filepath, BMC_DATABASE_FILE))
})
dbwatcher.on('ready', () => {
  debug('ready')
})
