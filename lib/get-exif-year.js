'use strict'

const getPhotoInfo = require('./get-photo-info')

module.exports = async function getYearFromMetadata(filepath) {
    const metadata = await getPhotoInfo(filepath)
    return metadata.date.split('-')[0]
}
