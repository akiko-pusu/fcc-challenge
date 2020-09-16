// For https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice
const isValidDateFormat = (dateString) => {
  const pattern = /(\d{4})-(\d{2})-(\d{2})/
  return pattern.test(dateString)
}

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.freecodecamp.org')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

// Main for "APIs and Microservices Projects - Timestamp Microservice"
module.exports = function (app) {
  app.use(allowCrossDomain)

  app.get('/api/timestamp/', function (req, res) {
    const resultDate = Date.now()
    const result = { unix: resultDate, utc: resultDate }
    console.log(result)
    res.json(result)
  })

  app.get('/api/timestamp/:date_string?', function (req, res) {
    let dateString = req.params.date_string
    console.log(dateString)
    let resultDate, result
    try {
      if (dateString == '' || isValidDateFormat(dateString)) {
        resultDate = new Date(dateString)
        result = {
          unix: resultDate.getTime(),
          utc: resultDate.toUTCString()
        }
      } else {
        dateString = parseInt(dateString)
        if (isNaN(dateString)) {
          result = {
            error: 'Invalid Date'
          }
        } else {
          resultDate = new Date(dateString)
          result = {
            unix: resultDate.getTime(),
            utc: resultDate.toUTCString()
          }
        }
      }
      res.send(result)
    } catch (e) {
      console.log('error')
      res.send({
        exception: 'Invalid Date'
      })
    }
  })
}
