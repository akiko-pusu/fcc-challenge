// Ref. https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/cash-register
const UNIT = {
  0.01: "PENNY",
  0.05: "NICKEL",
  0.1: "DIME",
  0.25: "QUARTER",
  1: "ONE",
  5: "FIVE",
  10: "TEN",
  20: "TWENTY",
  100: "ONE HUNDRED"
};


const UNITS = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.1,
  "QUARTER": 0.25,
  "ONE": 1,
  "FIVE": 5,
  "TEN": 10,
  "TWENTY": 20,
  "ONE HUNDRED": 100
};


function isEnough(change, cidObj, currency) {
  let total = 0;
  let target = 0;

  let keys = Object.keys(cidObj);
  keys.forEach(function (item) {
    if (currency.includes(Number(item))) {
      target += cidObj[item]['amount'] * 100;
    }
    total += cidObj[item]['amount'] * 100;
  });

  if (total == change * 100) {
    return "CLOSED";
  }

  if (target < change * 100 || target == 0) {
    return "INSUFFICIENT_FUNDS";
  }

  return "OPEN";
}

/*
currencys(0.5)
[ '0.01', '0.05', '0.1', '0.25' ]
*/
function currencys(change) {
  let keys = Object.keys(UNIT);
  let units = keys.map((item) => parseFloat(item));
  units = units.filter((value) => { return change > value });
  return units.sort((a, b) => a - b).reverse();
}

/*
 cidObj
 [["PENNY", 1.01], ["NICKEL", 2.05] ] =>
    { '0.01': { amount: 1.01, coins: 101, key: 'PENNY', unit: 0.01 },
      '0.05': { amount: 2.05, coins: 41, key: 'NICKEL', unit: 0.05 } }
*/
function generateObj(change, units, retval, cidObj) {
  // condition to end up recrsive
  if (units.length == 0) {
    return [];
  }

  let c_unit = units[0];
  let c_name = UNIT[c_unit];

  // その単位の残りを計算する
  let rest = cidObj[c_unit].amount;

  // お釣りの金額が対応する一番上の位のコインではまかないきれない場合
  if (rest < change) {
    // 一旦一番上の位のコインでの残高を引く
    change = (change - rest).toFixed(2);
    retval[c_name] = rest;

    // 一つコインの単位を下げる
    units.shift();
    generateObj(change, units, retval, cidObj);
  }

  // お釣りの金額が対応する一番上の位のコインでもカバーできる場合
  // ちょうどの場合と端数の場合を考慮する
  if (rest >= change) {

    // 対象のコインの何枚分かのお釣りがある場合
    if (change >= units[0]) {
      change = (change - parseFloat(c_unit)).toFixed(2);
      if (retval.hasOwnProperty(c_name)) {
        retval[c_name] += parseFloat(c_unit);
      } else {
        retval[c_name] = parseFloat(c_unit);
      }
      generateObj(change, units, retval, cidObj);
    } else if (change < c_unit) {
      units.shift();
      generateObj(change, units, retval, cidObj);
    }
  }
  return Object.entries(retval);
};


/*
 [["PENNY", 1.01], ["NICKEL", 2.05] ] =>
    { '0.01': { amount: 1.01, coins: 101, key: 'PENNY', unit: 0.01 },
      '0.05': { amount: 2.05, coins: 41, key: 'NICKEL', unit: 0.05 } }
*/
function convertCid(cid) {
  let obj = {};

  cid.forEach(function (item) {
    let divided = item[1] * 100;
    let divider = UNITS[item[0]] * 100;
    obj[UNITS[item[0]]] = {
      amount: item[1], coins: Math.round(divided / divider), key: item[0], unit: UNITS[item[0]]
    };
  });
  return obj;
}

function checkCashRegister(price, cash, cid) {
  let changeVal = cash - price;
  let currency = currencys(changeVal);
  let cidObj = convertCid(cid);

  let status = isEnough(changeVal, cidObj, currency);
  let change = [];

  switch (status) {
    case "INSUFFICIENT_FUNDS":
      break;
    case "CLOSED":
      change = cid;
      break;
    case "OPEN":
      change = generateObj(changeVal, currency, {}, cidObj);
      break;
  }
  return { status: status, change: change }
}

checkCashRegister(19.5, 20, [
    ["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], 
    ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], 
    ["TEN", 20], ["TWENTY", 60],["ONE HUNDRED", 100]
  ]
);
