const pug = require('pug')
const compiledFunction = pug.compileFile('views/template.pug')

module.exports = (app) => {
  app.set('view engine', 'pug')

  app.get('/pug', (req, res) => {
    res.send('Hello World! I\'m from Japan! ' + compiledFunction({ name: 'Shiba-Wanko', message: 'Test....' }))
  })

  app.get('/', (req, res) => {
    res.render(process.cwd() + '/views/pug/index', { title: 'Hello', message: 'Please login' })
  })
}
