const express = require('express')
const app = express()
const port = 3000

const now = new Date()

app.get('/', (req, res) => res.send(`Hello World! Server started: ${now}`))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))