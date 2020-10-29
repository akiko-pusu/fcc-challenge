/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */

function ConvertHandler() {
  // should be private
  this.unitPair = {
    'gal': {
      unit: 'l',
      rate: 3.78541,
      spelling: 'gallons'
    },
    'lbs': {
      unit: 'kg',
      rate: 0.453592,
      spelling: 'ponds'
    },
    'mi': {
      unit: 'km',
      rate: 1.60934,
      spelling: 'miles'
    },
    'l': {
      unit: 'gal',
      rate: 1 / 3.78541,
      spelling: 'liters'
    },
    'kg': {
      unit: 'lbs',
      rate: 1 / 0.453592,
      spelling: 'kilograms'
    },
    'km': {
      unit: 'mi',
      rate: 1 / 1.60934,
      spelling: 'kilometers'
    } //  1.60934
  };

  this.parseNumber = function (input) {
    const numPattern = /^([\d+\.|\/{0,1}\d+]{0,})/i;
  }

  // should be private
  this.parseInput = function (input) {
    this.input = input;

    const regex = /^([\d+\.|\/{0,1}\d+]{0,})(gal|lbs|mi|kg|l|km){1}$/i;
    const formatCheck = this.input.match(regex);

    const unitPattern = /(gal|lbs|mi|kg|l|km)$/i;
    this.unitResults = this.input.match(unitPattern);

    const numPattern = /^([\d+\.|\/{0,1}\d+]{0,})/i;
    this.numResults = this.input.match(numPattern);

    if (this.numResults && this.numResults[1] != '' && this.unitResults === null) throw 'invalid unit';

    if (this.numResults && this.unitResults) {
      const str = this.unitResults[1] + this.numResults[0]
      if (str.length != input.length) throw 'invalid number';
    }

    if (this.numResults === null && this.unitResults) throw 'invalid number';
    if (formatCheck == null) throw 'invalid number and unit';
    return
  }

  this.getNum = function (input) {
    this.parseInput(input);

    const val = this.numResults[1];
    if (val != '') {
      let val = this.evalString(this.numResults[1])
      return Math.round(val * 10 ** 5) / 10 ** 5
    }
    return 1;
  };

  this.getUnit = function (input) {
    this.parseInput(input);
    return this.unitResults[1].toLowerCase();
  };

  this.getReturnUnit = function (initUnit) {
    const returnUnit = this.unitPair[initUnit.toLowerCase()].unit;
    return returnUnit;
  };

  this.convert = function (initNum, initUnit) {
    const rate = this.unitPair[initUnit.toLowerCase()].rate;
    return Math.round((rate * initNum) * 10 ** 5) / 10 ** 5;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const initUnitSpell = this.unitPair[initUnit.toLowerCase()].spelling;
    const returnUnitSpell = this.unitPair[returnUnit.toLowerCase()].spelling;

    const retval = {
      initNum: initNum,
      initUnit: initUnit,
      returnNum: returnNum,
      returnUnit: returnUnit,
      string: `${initNum} ${initUnitSpell} converts to ${returnNum} ${returnUnitSpell}`
    }
    return retval;
  };

  // Not to use `eval`.
  // Ref. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval!
  this.evalString = function (str) {
    return Function('"use strict";return (' + str + ')')();
  };
}

module.exports = ConvertHandler;