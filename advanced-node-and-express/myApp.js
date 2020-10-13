const pug = require('pug')
const compiledFunction = pug.compileFile('template.pug')

module.exports = (app) => {
  app.set('view engine', 'pug')

  app.get('/', (req, res) => {
    res.send(`Hello World! I'm from Japan! ` + compiledFunction({ name: 'Shiba-Wanko' }))
  })
}
