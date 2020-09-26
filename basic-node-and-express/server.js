// For APIs and Microservices Projects - URL Shortener Microservice
require('dotenv').config()

const express = require('express')
const app = express()

// For "APIs and Microservices Projects - Request Header Parser Microservice"
require('./project_3')(app)

// node server.js
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
