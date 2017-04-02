var express = require('express')
var cors = require('cors')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
//var csrf = require('lusca').csrf()
var config = require('./config')

var server = express()

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
