// File for Basic Node and Express
const app = require('./myApp')

// Enableddotenv
require('dotenv').config()

// For "APIs and Microservices Projects - Timestamp Microservice"
require('./project_1')(app)

// For "APIs and Microservices Projects - Request Header Parser Microservice"
require('./project_2')(app)

// This is required!
// node server.js
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
