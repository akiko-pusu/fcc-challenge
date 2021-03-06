/* eslint-disable no-undef */
/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

var chai = require('chai')
var assert = chai.assert
var ConvertHandler = require('../controllers/convertHandler.js')

var convertHandler = new ConvertHandler()

// eslint-disable-next-line no-undef
suite('Unit Tests', function () {
  suite('Function convertHandler.getNum(input)', function () {
    test('Whole number input', function (done) {
      var input = '32L'
      assert.equal(convertHandler.getNum(input), 32)
      done()
    })

    test('Decimal Input', function (done) {
      var input = '32.1390000L'
      assert.equal(convertHandler.getNum(input), 32.139)
      done()
    })

    test('Fractional Input', function (done) {
      var input = '1/4L'
      assert.equal(convertHandler.getNum(input), 0.25)
      done()
    })

    test('Fractional Input w/ Decimal', function (done) {
      var input = '12.8/4L'
      assert.equal(convertHandler.getNum(input), 3.2)
      done()
    })

    test('Invalid Input (double fraction)', function (done) {
      var input = 'as12L'
      assert.throws(function () {
        convertHandler.getNum(input)
      }, /invalid number/)
      done()
    })

    test('No Numerical Input', function (done) {
      var input = 'L'
      assert.equal(convertHandler.getNum(input), 1)
      done()
    })
  })

  suite('Function convertHandler.getUnit(input)', function () {
    test('For Each Valid Unit Inputs', function (done) {
      var input = ['gal', 'l', 'mi', 'km', 'lbs', 'kg', 'GAL', 'L', 'MI', 'KM', 'LBS', 'KG']
      input.forEach(function (ele) {
        assert.equal(convertHandler.getUnit(ele), ele.toLowerCase())
      })
      done()
    })

    test('Unknown Unit Input', function (done) {
      var input = '1gas'
      assert.throws(function () {
        convertHandler.getUnit(input)
      }, /invalid unit/)
      done()
    })
  })

  suite('Function convertHandler.getReturnUnit(initUnit)', function () {
    test('For Each Valid Unit Inputs', function (done) {
      var input = ['gal', 'l', 'mi', 'km', 'lbs', 'kg']
      var expect = ['l', 'gal', 'km', 'mi', 'kg', 'lbs']
      input.forEach(function (ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i])
      })
      done()
    })
  })

  /*
  suite('Function convertHandler.spellOutUnit(unit)', function () {
    test('For Each Valid Unit Inputs', function (done) {
      var input = ['gal','l','mi','km','lbs','kg']
      var expect = ['l','gal','km','mi','kg','lbs']
      input.forEach(function (ele, i) {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i])
      })
      done()
    })
  })
  */

  suite('Function convertHandler.convert(num, unit)', function () {
    test('Gal to L', function (done) {
      var input = [5, 'gal']
      var expected = 18.9271
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1) //0.1 tolerance
      done()
    })

    test('L to Gal', function (done) {
      var input = [10, 'L']
      var expected = 2.64172
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1)
      done()
    })

    test('Mi to Km', function (done) {
      var input = [3, 'mi']
      var expected = 4.82802
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1)
      done()
    })

    test('Km to Mi', function (done) {
      var input = [5, 'km']
      var expected = 3.10686
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1)
      done()
    })

    test('Lbs to Kg', function (done) {
      var input = [10, 'lbs']
      var expected = 4.53592
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1)
      done()
    })

    test('Kg to Lbs', function (done) {
      var input = [1, 'kg']
      var expected = 2.20462
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1)
      done()
    })
  })
})
