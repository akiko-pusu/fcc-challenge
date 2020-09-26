// For https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice
// APIs and Microservices Projects - URL Shortener Microservice

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.freecodecamp.org')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

const path = require('path')
const dns = require('dns')
const url = require('url')
const bodyParser = require('body-parser')


const absolutePath = path.join(__dirname, '/views/project_3/index.html')
const assetsPath = path.join(__dirname, '/public')

require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Hold the sequencial number. (MongoDB default _id is based on hash.)
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Schema = mongoose.Schema;
const urlSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    id: { type: Number }
  }
);

urlSchema.plugin(AutoIncrement, {inc_field: 'id'})

urlSchema.statics.findOneOrCreate = async function findOneOrCreate(condition) {
  const result = await findOneByCondition(condition, function (err, data) {
    if (err) return console.error(err)
  })

  if (result) {
    console.log(`Before create Foud: ${result.originalUrl}`)
    return result
  } else {
    return new ShorteUrl(condition).save()
  }
}

const ShorteUrl = mongoose.model('ShorteUrl', urlSchema)

// Get the hostname from passed url string.
const hostnameFromUrl = function (originalUrl) {
  const parsedLookupUrl = url.parse(originalUrl)

  console.log(parsedLookupUrl)
  return parsedLookupUrl.hostname
}

// Validate the hostname
const validateHostname = function (hostname) {
  return new Promise((resolve, reject) => {
    dns.resolve(hostname, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve({ result })
      }
    })
  })
}

const findOneByCondition = async function (condition) {
  // Need to handle timeout
  const result = await ShorteUrl.findOne(condition, {}, { maxTime: 10 }, function (err, data) {
    if (err) return console.error(err)
    console.log(`Foud: ${data}`)
  })
  return result
}

// Main part to handle requests.
module.exports = function (app) {
  // Need to allow access via freeCodeCamp test script
  app.use(allowCrossDomain)

  // Parse request parameters
  app.use(bodyParser.urlencoded({ extended: false }))

  // default top page
  app.get('/', function (req, res) {
    res.sendFile(absolutePath)
  })

  // 1. POST a URL and create or find the record.
  app.post('/api/shorturl/new', function (req, response) {
    const originalUrl = req.body.url
    const hostname = hostnameFromUrl(originalUrl)

    // in case hostname isinvalid, return error
    if (hostname === null) {
      console.log('Host name is null')
      response.json({ error: 'invalid URL' })
      return
    }

    // Create or find one only when the url is valid.
    validateHostname(hostname).then(() => {
      console.log(`start to create or find ${originalUrl}`)
      ShorteUrl.findOneOrCreate({ originalUrl: originalUrl }).then((data) => {
        console.log(data)
        const result = { original_url: data.originalUrl, short_url: data.id }
        return response.json(result)
      })
    }).catch((err) => {
      console.log(`Msg: ${err}`)
      return response.json({ error: 'invalid URL' })
    })
  })

  // 2. When I visit the shortened URL, it will redirect me to my original link.
  app.get('/api/shorturl/:url_id', function (req, res) {
    const urlId = req.params.url_id
    console.log(`URL ID: ${urlId}`)

    const condition = { id: urlId }

    findOneByCondition(condition).then((result) => {
      console.log(result.originalUrl)
      res.redirect(result.originalUrl)
      res.end()
    })
  })
}
