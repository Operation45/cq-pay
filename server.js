const express = require('express')
const cors = require('cors')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const config = require('./config')

const server = express()

server.disable('x-powered-by')
server.set('host', config.host)
server.set('port', config.port)
server.set('env', config.env)
server.set('startTime', new Date())
server.use(logger('dev'))
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())

server.use(function(req, res, next) {
  console.log(`${req.method} ${req.url}`)
  next()
})

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  })
})

module.exports = server
