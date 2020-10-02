// For https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/file-metadata-microservice
// APIs and Microservices Projects - File Metadata Microservice
/*

User Stories:

1. I can submit a form object that includes a file upload.
2. The from file input field has the "name" attribute set to "upfile". We rely on this in testing.

POST: /api/fileanal

3. When I submit something, I will receive the file name, and size in bytes within the JSON response.

-> Response:
content-type: application/json

{"name":"index.html","type":"text/html","size":1569}
{"name":"freecodeCamp.png","type":"image/png","size":74286}
*/

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.freecodecamp.org')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

const path = require('path')
const bodyParser = require('body-parser')
const Busboy = require('busboy')

const absolutePath = path.join(__dirname, '/views/project_5/index.html')

function FileCheck (req) {
  return new Promise((resolve) => {
    const retval = {}
    let busboy = new Busboy({
      headers: req.headers
    })

    const size = req.headers['content-length']

    const fields = {}

    // get the field name
    busboy.on('field', (fieldname, val) => {
      console.log(`event: field - ${fieldname}`)
      fields[fieldname] = val
    })

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      file.on('data', () => {
        retval.name = filename
        retval.type = mimetype
      })
    })
    busboy.on('finish', () => {
      console.log('Upload complete')
      // pass the value to resolve (This value will be passed as return value :)
      retval.size = size
      console.log(new Date().getTime() + ' event: file - ' + JSON.stringify(retval))
      resolve(retval)
    })
    req.pipe(busboy)
  })
}

// Main part to handle requests.
module.exports = function (app) {
  // Need to allow access via freeCodeCamp test script
  app.use(allowCrossDomain)
  // Parse request parameters
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // default top page
  app.get('/', function (req, res) {
    res.sendFile(absolutePath)
  })

  // 1. POST and response
  app.post('/api/fileanalyse', (request, response) => {
    // let fileResult
    FileCheck(request).then((fileResult) => {
      response.json(fileResult)
    })
  })
}
