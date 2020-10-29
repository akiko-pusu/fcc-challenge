/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  const convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res) {
      try {
        const input = req.query.input;
        convertHandler.parseInput(input);
        const initNum = convertHandler.getNum(input);
        const initUnit = convertHandler.getUnit(input);
        const returnNum = convertHandler.convert(initNum, initUnit);
        const returnUnit = convertHandler.getReturnUnit(initUnit);

        const toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
        res.json(toString)
      } catch (e) {
        res.send(e)
      }
    });
};