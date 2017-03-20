#!/usr/bin/env node
'use strict'

process.on('unhandledRejection', function(reason, p) {
    console.error('Unhandled rejection in', p)
    console.error('Reason:', reason)
})

require('./watch-jobs')
require('./watch-db')
