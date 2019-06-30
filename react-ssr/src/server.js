// Import module with ES6's way, using 'import' statement.
import express from 'express'
import compression from 'compression'
import ssr from './routes/ssr'

const app = express()

app.use(compression())

// To serve static files such as images, CSS files, and JavaScript files,
// use the express.static built-in middleware function in Express.
app.use(express.static('public'))

// Top page
app.get('/', (req, res) => res.sendFile('index.html'))

// apply route and its action.
app.use('/firstssr', ssr)

const port = process.env.PORT || 3030
app.listen(port, function listenHandler () {
  console.info(`Running on ${port}...`)
})
