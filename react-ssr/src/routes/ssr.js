// Import module with ES6's way, using "import" statement.
import express from 'express'
import App from '../components/app'
import hbs from 'handlebars'
import React from 'react'
import { renderToString } from 'react-dom/server'

const router = express.Router()
/*
router.get('/', async (req, res) => {
  res.status(201).send('Hello World')
})
*/

// Render using HTML Template.
router.get('/', async (req, res) => {
  const theHtml = `
  <html>
    <head><title>My First SSR</title></head>
    <body>
      <h1>My First Server Side Render</h1>
      <div id="reactele">{{{reactele}}}</div>
      <script src="/js/app.js" charset="utf-8"></script>
      <script src="/js/vendor.js" charset="utf-8"></script>
    </body>
  </html>
  `
  const hbsTemplate = hbs.compile(theHtml)
  const reactComp = renderToString(<App />)
  const htmlToSend = hbsTemplate({reactele: reactComp })
  res.send(htmlToSend)
})

export default router
