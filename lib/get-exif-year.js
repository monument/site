'use strict'

const get = require('lodash/get')
const exif = require('./exif')
const pify = require('pify')
const parseMetadata = pify(exif.parse)

module.exports = async function getYearFromMetadata(filepath) {
    const metadata = await parseMetadata(filepath)
    const datetime = get(metadata, ['SubExif', 'DateTimeOriginal'])
    if (datetime) {
        return datetime.split(':')[0]
    }
    return new Date().getFullYear().toString()
}
