// File for Basic Node and Express
const app = require('./myApp')

// dotenvを有効にする指定
require('dotenv').config()

// これがないと起動しません
// node server.js
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
