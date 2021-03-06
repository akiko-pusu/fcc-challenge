'use strict'

// dotenvを有効にする指定
require('dotenv').config()

// Create app with Express framework
const express = require('express')

// Need to parse body(post) content
const bodyParser = require('body-parser')

// For test: expect and chai
const expect = require('chai').expect

// For CrossDomain
const cors = require('cors')

// For test runner
const fccTestingRoutes = require('./routes/fcctesting.js')
const runner = require('./test-runner')

// For main application
const apiRoutes = require('./routes/api.js')

const app = express()

app.use('/public', express.static(process.cwd() + '/public'))

// For FCC testing purposes only
app.use(cors({
  origin: '*'
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html')
  })

// For FCC testing purposes
fccTestingRoutes(app)

// Routing for API(main)
apiRoutes(app)

// 404 Not Found Middleware
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found')
})

// Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + process.env.PORT)
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...')
    setTimeout(function () {
      try {
        runner.run()
      } catch (e) {
        var error = e
        console.log('Tests are not valid:')
        console.log(error)
      }
    }, 1500)
  }
})

// for testing
module.exports = app
