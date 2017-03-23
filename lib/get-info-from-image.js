'use strict'

const path = require('path')
const stripext = require('./strip-ext')
const getExifYear = require('./get-exif-year')

module.exports = async function getInfoFromImage(filepath, {root, useDirName} = {}) {
  const jobYear = await getExifYear(filepath)

  const filename = path.basename(filepath)

  // get the filename without the extension
  const baseFilename = stripext(filename)

  // files are named either as "$name - Back" or "$name_1"
  // so we want to remove those qualifiers to find the "job" folder
  let jobName = baseFilename.split(/ - |_\d/)[0]

  const folderNameAsJobName = path.basename(path.dirname(filepath))
  if (useDirName) {
    jobName = folderNameAsJobName
  }
  console.log({filepath, useDirName, jobName, folderNameAsJobName, baseFilename})

  const destDir = path.join(root, jobYear, jobName)

  return {baseFilename, filename, jobName, destDir, jobYear}
}
