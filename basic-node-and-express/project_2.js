// For https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/request-header-parser-microservice
// Request Header Parser Microservice

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.freecodecamp.org')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

/*

Endpoint: /api/whoami

User stories:
I can get the IP address, preferred languages (from header Accept-Language) and system infos (from header User-Agent) for my device.

Example usage:
[base_url]/api/whoami

Example output:
{"ipaddress":"159.20.14.100","language":"en-US,en;q=0.5","software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}

*/

// Handle Request header: http://expressjs.com/en/api.html#req
const headerResult = function (req) {
  let result = {}
  result = {
    ipaddress: req.ip,
    language: req.header('accept-language'),
    software: req.header('User-Agent')
  }
  return result
}

module.exports = function (app) {
  app.use(allowCrossDomain)

  app.get('/api/whoami/', function (req, res) {
    const result = headerResult(req)
    console.log(result)
    res.json(result)
  })
}
