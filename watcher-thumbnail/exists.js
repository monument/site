'use strict'

const pify = require('pify')
const fs = require('graceful-fs')
const access = pify(fs.access)

module.exports = async function exists(path) {
	try {
		await access(path)
		return true
	} catch (err) {
		return false
	}
}
