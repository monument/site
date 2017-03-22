#!/usr/bin/env node
'use strict'

const fs = require('fs')
const pify = require('pify')
const fsAsync = pify(fs)
const present = require('present')
const path = require('path')
const get = require('lodash/get')
const qs = require('querystring')
const fuzzy = require('fuzzysearch')

const Koa = require('koa')
const Router = require('koa-router')
const etag = require('./etag')
const app = new Koa()
const router = new Router()

async function readJsonFile(filepath) {
  return JSON.parse(await fsAsync.readFile(filepath, 'utf-8'))
}

const readJobFile = async (year, name) => {
  const jobPath = path.join(
    process.env['BMC_METADATA_DIR'],
    year,
    name,
    'index.json'
  )
  return await readJsonFile(jobPath)
}

const streamJobImage = ({year, jobname, filename, size, scale}) => {
  const scaleSuffix = scale && scale !== '@1x' ? `${scale}` : ''
  const jobPath = path.join(
    process.env['BMC_THUMBNAILS_DIR'],
    year,
    jobname,
    `${filename}_${size}${scaleSuffix}.jpg`
  )
  return fs.createReadStream(jobPath)
}

router.get('/jobs', async (ctx, next) => {
  await next()
  ctx.type = 'json'
  ctx.body = fs.createReadStream(process.env['BMC_DATABASE_FILE'], 'utf-8')
})

router.get('/jobs/search', async (ctx, next) => {
  await next()

  let query
  try {
    query = qs.parse(ctx.request.search.substr(1)).q
  } catch (err) {
    ctx.throw(500)
    return
  }

  try {
    const db = await readJsonFile(process.env['BMC_DATABASE_FILE'])

    const jobs = db.filter(
      j =>
        fuzzy(query, j.title.toLowerCase()) ||
        Object.values(j.info)
          .map(v => Array.isArray(v) ? v.join(', ') : v)
          .filter(v => v)
          .map(v => v.toLowerCase())
          .some(v => fuzzy(query, v))
    )

    ctx.type = 'json'
    ctx.body = jobs
  } catch (err) {
    ctx.throw(500)
  }
})

router.get('/job/:year/:name', async (ctx, next) => {
  await next()
  try {
    ctx.type = 'json'
    ctx.body = fs.createReadStream(
      path.join(
        process.env['BMC_METADATA_DIR'],
        ctx.params.year,
        ctx.params.name,
        'index.json'
      )
    )
  } catch (err) {
    console.error(err)
    if (err.statusCode === 'ENOENT') {
      ctx.throw(404)
    } else {
      ctx.throw(500)
    }
  }
})

router.get('/job/:year/:name/featured', async (ctx, next) => {
  await next()
  try {
    const job = await readJobFile(ctx.params.year, ctx.params.name)
    const featuredPhoto = job.photos.find(p => p.filename === job.featured)
    ctx.type = 'json'
    ctx.body = featuredPhoto
  } catch (err) {
    console.error(err)
    if (err.statusCode === 'ENOENT') {
      ctx.throw(404)
    } else {
      ctx.throw(500)
    }
  }
})

router.get('/job/:year/:name/:key', async (ctx, next) => {
  await next()
  try {
    const job = await readJobFile(ctx.params.year, ctx.params.name)
    ctx.type = 'json'
    ctx.body = get(job, ctx.params.key)
  } catch (err) {
    console.error(err)
    if (err.statusCode === 'ENOENT') {
      ctx.throw(404)
    } else {
      ctx.throw(500)
    }
  }
})

router.get('/job/:year/:name/photo/:filename', async (ctx, next) => {
  await next()
  try {
    const job = await readJobFile(ctx.params.year, ctx.params.name)
    const photo = job.photos.find(p => p.filename === ctx.params.filename)
    ctx.type = 'json'
    ctx.body = photo
  } catch (err) {
    console.error(err)
    if (err.statusCode === 'ENOENT') {
      ctx.throw(404)
    } else {
      ctx.throw(500)
    }
  }
})

router.get('/job/:year/:name/featured/:size/:scale?', async (ctx, next) => {
  await next()
  try {
    const job = await readJobFile(ctx.params.year, ctx.params.name)
    const featuredPhoto = job.photos.find(p => p.filename === job.featured)

    const {year, name: jobname, size, scale} = ctx.params

    ctx.type = 'jpg'
    ctx.body = streamJobImage({
      year,
      jobname,
      filename: featuredPhoto.filename,
      size,
      scale,
    })
  } catch (err) {
    console.error(err)
    if (err.statusCode === 'ENOENT') {
      ctx.throw(404)
    } else {
      ctx.throw(500)
    }
  }
})
router.get(
  '/job/:year/:name/photo/:filename/:size/:scale?',
  async (ctx, next) => {
    await next()
    try {
      const {year, name: jobname, filename, size, scale} = ctx.params
      ctx.type = 'jpg'
      ctx.body = streamJobImage({year, jobname, filename, size, scale})
    } catch (err) {
      console.error(err)
      if (err.statusCode === 'ENOENT') {
        ctx.throw(404)
      } else {
        ctx.throw(500)
      }
    }
  }
)

router.get('/job/:id', async (ctx, next) => {
  await next()
  const db = await readJsonFile(process.env['BMC_DATABASE_FILE'])

  const match = db.find(j => j.id === ctx.params.id)
  if (match) {
    ctx.type = 'json'
    ctx.body = JSON.stringify(match)
  } else {
    ctx.throw(404)
  }
})

app.use(async (ctx, next) => {
  const start = present()
  await next()
  const ms = present() - start
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} ${ms.toFixed(2)}ms`)
  ctx.response.append('X-Response-Time', `${ms.toFixed(0)}ms`)
})

app.use(async (ctx, next) => {
  await next()
  ctx.response.append('Access-Control-Allow-Origin', '*')
})

app.use(async (ctx, next) => {
  await next()
  if (ctx.fresh) {
    ctx.status = 304
    ctx.body = null
  }
})

app.use(etag())

app.use(router.routes()).use(router.allowedMethods())

const PORT = 3001
app.listen(PORT, () => console.log(`listening on localhost:${PORT}`))
