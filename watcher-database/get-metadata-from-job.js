'use strict'

const path = require('path')
const sortBy = require('lodash/sortBy')
const min = require('lodash/min')
const first = require('lodash/first')
const mergeWith = require('lodash/mergeWith')
const uuid = require('uuid/v4')
const pify = require('pify')
const glob = pify(require('glob'))
const getPhotoMetadata = require('./get-photo-metadata')
const {readJobMetadata} = require('./job-metadata')

module.exports = async function getMetadataFromJob(jobYear, jobName, {photosBase, metadataBase}={}) {
  const data = await readJobMetadata(jobYear, jobName, {base: metadataBase})

  const jobPhotoDir = path.join(photosBase, jobYear, jobName)
  const photoFiles = await listPhotoFilesForJob(jobPhotoDir)
  const photos = await Promise.all(photoFiles.map(getPhotoMetadata))

  // set the photos list
  data.photos = photos

  // set job.date to the oldest dated photo
  data.date = photos.length ?
    min(data.photos.map(p => p.date))
    : null

  // set job.year to the year of job.date
  data.year = photos.length
    ? data.date.split('-')[0]
    : null

  // if no id: generate a new UUID
  // !data.id && console.log(data, data.id)
  data.id = data.id || uuid()

  // if no title: set title to job name
  data.title = data.title || jobName

  // if no featured image: set the "featured" image to the oldest photo
  data.featured = data.photos.length
    ? first(sortBy(photos, p => p.datetime)).filename
    : null

  data.info = mergeWith({
    attributes: [],
    category: null,
    color: null,
    finish: null,
    keywords: [],
    material: null,
    shape: null,
    size: null,
    style: null,
  }, data.info, customizer)

  return data
}

async function listPhotoFilesForJob(jobPhotoDir) {
  return glob(path.join(jobPhotoDir, '**/*.{jpg,jpeg}'))
}

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}
