// File for Basic Node and Express
// main App (この中でもExpressを使います)
var express = require('express')
var app = express()

module.exports = app

// https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/meet-the-node-console
// Modify the myApp.js file to log "Hello World" to the console.
// server.js から読み込まれます (もしくは単体で node myApp.js を実行したら 'Hello World' と出力)
console.log("Hello World")
