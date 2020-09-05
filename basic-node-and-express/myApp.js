const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
module.exports = app

const absolutePath = path.join(__dirname, '/views/index.html')
const assetsPath = path.join(__dirname, '/public') // ここを静的ファイルとして読み込ませたい

app.use(express.static(assetsPath))

// body-parserを適用する
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
  // req.method, req.path and req.ip
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendFile(absolutePath)
})

app.get('/json', function (req, res) {
  let message = 'Hello json'

  if (process.env.MESSAGE_STYLE == 'uppercase') {
    message = 'HELLO JSON'
  }

  const obj = { message: message }
  // pass the Object as argument
  res.json(obj)
})

// Chain Middleware to Create a Time Server
app.get(
  '/now',
  function (req, res, next) {
    req.time = new Date().toString() // Hypothetical synchronous operation
    next()
  },
  function (req, res) {
    res.send({ time: req.time })
  }
)

// Chain Middleware to Create a Time Server
app.get('/:word/echo', function (req, res) {
  res.send({ echo: req.params.word })
})

// Chain Middleware to Create a Time Server
app
  .get('/name', function (req, res) {
    res.send({ name: `${req.query.first} ${req.query.last}` })
  })
  .post('/name', function (req, res) {
    res.send({ name: `${req.body.first} ${req.body.last}` })
  })
