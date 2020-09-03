// File for Basic Node and Express
var myApp = require('./myApp')
var express = require('express')
var app = express()

// これがないと起動しません
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
