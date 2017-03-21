'use strict'

const {stripext, exif} = require('../lib')
const pify = require('pify')
const fs = pify(require('fs'))
const parseExifMetadata = pify(exif.parse)

module.exports = async function getPhotoMetadata(filepath) {
  const [exifData, statInfo] = await Promise.all([
    parseExifMetadata(filepath),
    fs.stat(filepath),
  ])

  let date
  let time
  if (exifData.SubExif) {
    const timestring = exifData.SubExif.DateTimeOriginal
    const split = timestring.split(' ')
    date = split[0].replace(/:/g, '-')
    time = split[1]
  } else {
    const t = statInfo.mtime
    date = `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`
    time = `${t.getHours()}:${t.getMinutes() + 1}:${t.getSeconds()}`
  }

  return {
    size: String(statInfo.size),
    filename: stripext(filepath),
    date: date,
    datetime: `${date} ${time}`,
    modified: String(statInfo.mtime.getTime()),
  }
}
