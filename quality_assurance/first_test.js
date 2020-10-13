// sample script
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const should = chai.should()

chai.use(chaiHttp)

/*
console.log('test!')
chai.request('http://localhost:3000')
  .get('/')
  .end((_err, res) => {
    expect(res).to.have.status(200)
  })
*/

chai.request('https://boilerplate-mochachai.akikopusu.repl.co')
  .get('/hello?name=akiko')
  .end((_err, res) => {
    console.log(res.text)
    expect(res).to.have.status(200)

    // res.text contains the response as a string
    expect(res.text).to.equal('hello akiko', 'response should be "hello akiko"')
  })
