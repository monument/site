'use strict'

const flatMap = require('lodash/flatMap')
const path = require('path')
const mkdirp = require('mkdirp')
const exists = require('./exists')
const _debug = require('debug')
const logqueue = _debug('bmc:watcher:thumbnail:generator:queue')
const logignore = _debug('bmc:watcher:thumbnail:generator:ignore')
const logbegin = _debug('bmc:watcher:thumbnail:generator:stream')
const logsuccess = _debug('bmc:watcher:thumbnail:generator:success')
const logerror = _debug('bmc:watcher:thumbnail:generator:error')

const sharp = require('sharp')
sharp.simd(true)

// .rotate() with no args automatically rotates the image
const pipeline = (input, w, h) => sharp(input).rotate().resize(w, h ? h : null)

const jpeg = (...args) =>
  pipeline(...args).jpeg({
    quality: 70,
    trellisQuantisation: true,
    optimiseScans: true,
  })

const webp = (...args) =>
  pipeline(...args).webp({
    quality: 70,
  })

const THUMBNAILS = flatMap([100, 200, 400, 800, 1600], w => [
  [w, null], // original size
  [w, w], // square
  [w / 5 * 4, w], // portrait
  [w, w / 3 * 2], // landscape
]).map(dims => dims.map(Math.floor))

module.exports = function* generateThumbnailsFor(
  inputFilepath,
  {intoDir, basename, force = false}
) {
  mkdirp.sync(intoDir)

  const outputSizes = flatMap(THUMBNAILS, ([w, h]) => [
    {
      width: w,
      height: h,
      scale: 1,
      destPath: path.join(intoDir, `${basename}_${w}${h ? `x${h}` : ''}`),
    },
    {
      width: w * 2,
      height: h * 2,
      scale: 2,
      destPath: path.join(intoDir, `${basename}_${w}${h ? `x${h}` : ''}@2x`),
    },
  ])

  const outputFiles = flatMap(outputSizes, info => [
    Object.assign({}, info, {
      pipe: jpeg,
      destPath: `${info.destPath}.jpg`,
    }),
    // Object.assign({}, info, {
    //     pipe: webp,
    //     destPath: `${info.destPath}.webp`,
    // }),
  ])

  for (const {width, height, destPath, pipe} of outputFiles) {
    yield async () => {
      logqueue(`${destPath} ${force}`)
      if (!force && (await exists(destPath))) {
        logignore(destPath)
        return
      }
      logbegin(`"${inputFilepath}" -> "${destPath}"`)

      return pipe(inputFilepath, width, height).toFile(destPath).then(
        () => {
          logsuccess(destPath)
        },
        err => {
          logerror(destPath)
          console.error(err)
        }
      )
    }
  }
}
