// For https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker
// APIs and Microservices Projects - Exercise Tracker
// Hint: https://forum.freecodecamp.org/t/freecodecamp-challenge-guide-exercise-tracker/301505
/*
1. Create a new User

POST /api/exercise/new-user
   -> Returen json { "username":"sample1", "_id":"5f6f3e5c549e97002eb5ae20" }

If duplicate, return "Username already taken" with 400 Status Code

2. POST exercise

POST /api/exercise/add
POST body
{
date: "Sat Sep 26 2020",
description: "test exercise",
duration: 60,
userId: "5f6f3e5c549e9700xxxxx
}

-> returened json

{
  "_id":"5f6f3e5c549e97002eb5ae20", // exercise id
  "username":"sample1", // Added
  "date":"Sat Sep 26 2020",  // Format Changed
  "duration":60,
  "description":"test exercise"
}

3. GET users's exercise log

GET /api/exercise/log?{userId}[&from][&to][&limit]

Exp. /api/exercise/log?userId=5f6f3e5c549e97002eb5ae20
Return:

{
  "_id":"5f6f3e5c549e97002eb5ae20",
  "username":"sample1",
  "count":1,
  "log":[     // array
    {
      "description":"test exercise",
      "duration":60,
      "date":"Sat Sep 26 2020"
    }
  ]
}

If record empty:
{"_id":"5f726f0bb29da30030b53de0","username":"testdata","count":0,"log":[]}

If userid is not found:
Unknown userId

NOTE: Try to use express-validator to sanitize request parameter.
https://express-validator.github.io/docs/
*/

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://www.freecodecamp.org')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
}

const path = require('path')
const bodyParser = require('body-parser')
const dateformat = require('dateformat')

const absolutePath = path.join(__dirname, '/views/project_4/index.html')

// for sanitize
const {
  body,
  query,
  validationResult
} = require('express-validator')

require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const Schema = mongoose.Schema

// Users (複数形)でできます
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  }
})

// username is used as foreign key
// Date type exists
const exerciseSchema = new Schema({
  username: {
    type: String
  },
  date: {
    type: Date
  }, // "Sat Sep 26 2020",  // Format Changed with toDateString()
  duration: {
    type: Number
  },
  description: {
    type: String
  }
})

// User should be unique -> mangooseを利用するので、schema定義のときにindex: trueに
// nativeの場合はこんな感じ
// db.users.createIndex( { "user_id": 1 }, { unique: true } )

const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)

const findUser = async function (condition) {
  // Need to handle timeout
  const result = await User.findOne(condition, {}, {
    maxTime: 10
  })
  return result
}

const findExercise = async (condition, limit) => {
  let query = Exercise.find(condition).select('-_id -__v -username')
  if (limit) query = query.limit(limit)
  const result = await query.exec()
  return result
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

  // 1. POST a URL and create or find the record.
  app.post('/api/exercise/new-user', [
    // username must be escaped
    body('username').not().isEmpty().isAlphanumeric().escape()], (request, response) => {
    const username = request.body.username

    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.send('Invalid username: Alphabet and number only')
    }

    User.create({
      username: username
    }).then((result) => {
      // Exp. { _id: 5f709d746df0be4ba8d23aa9, username: 'sample1', __v: 0 }
      // __v is the key for versioning. (Assigned via mongoose)
      console.log(result)
      response.json({
        username: result.username,
        _id: result._id
      })
    }).catch((err) => {
      // in case duplicate username, returned "err = MongoError: E11000 duplicate key error collection"
      console.log(err)
      response.status(400)
      response.send('Username already taken')
    })
  })

  // 2. POST exercise
  app.post('/api/exercise/add', [
    // username must be an email
    body('userId').escape(),
    body('description').not().isEmpty().trim().escape(),
    body('duration').isInt(),
    body('date').optional({ nullable: true }).isDate()
  ], (request, response) => {
    // check Validation
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.json({ errors: errors.array() })
    }

    // Optional / Must be yyyy-mm-dd
    const dateString = request.body.date || ''
    let targetDate = !dateString ? new Date() : new Date(dateString)
    const userId = request.body.userId
    findUser({
      _id: userId
    }).then((result) => {
      if (result == null) {
        throw new Error('Unknown userId')
      }
      const record = {
        username: result.username,
        date: targetDate,
        description: request.body.description,
        duration: parseInt(request.body.duration)
      }

      // Return JSON (Note: _id = userId)
      Exercise.create(record).then((result) => {
        response.json({
          _id: userId,
          username: result.username,
          date: result.date.toDateString(),
          description: result.description,
          duration: result.duration
        })
      }).catch((ValidationError) => {
        console.log(`Exercise validation error: ${ValidationError}`)
        response.send(`${ValidationError.message}`)
      })
    }).catch((err) => {
      console.log(`User error: ${err}`)
      response.send(`${err.message}`)
    })
  })

  // 3. GET exercise data
  app.get('/api/exercise/log', [
    query('userId').not().isEmpty().escape(),
    query('from').optional({ nullable: true }).isDate(),
    query('to').optional({ nullable: true }).isDate(),
    query('limit').optional({ nullable: true }).isInt()
  ], (request, response) => {

    // check Validation
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      return response.json({ errors: errors.array() })
    }

    const from = request.query.from
    const to = request.query.to
    const userId = request.query.userId
    const limit = parseInt(request.query.limit)
    findUser({
      _id: userId
    }).then((result) => {
      if (result == null) {
        throw new Error('Unknown userId')
      }

      let baseResult = {
        _id: userId,
        username: result.username,
        count: 0,
        log: []
      }

      let dateCondition = {}
      if (from !== undefined && from) dateCondition.$gte = new Date(from)
      if (to !== undefined && to) dateCondition.$lt = new Date(to)

      let condition = {
        username: result.username
      }

      if (Object.keys(dateCondition).length) condition.date = dateCondition

      findExercise(condition, limit).then((records) => {
        console.log(records)
        baseResult.count = records.length

        let convertedRecords = []
        records.forEach((record) => {
          let result = {}
          result.description = record.description
          result.duration = record.duration
          result.date = dateformat(record.date, 'ddd mmm d yyyy')
          convertedRecords.push(result)
        })
        baseResult.log = convertedRecords
        response.json(baseResult)
      }).catch((err) => {
        console.log(err)
      })
    }).catch((err) => {
      console.log(`User error: ${err}`)
      response.send(`${err.message}`)
    })
  })

  // 4. GET /api/exercise/users
  app.get('/api/exercise/users', (request, response) => {
    let query = User.find().select('-_id -__v')
    query.exec().then((result) => {
      console.log(result)
      response.json(result)
    }).catch((err) => {
      console.log(`User error: ${err}`)
      response.send(`${err.message}`)
    })
  })
}
