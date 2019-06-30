// Ref. https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/telephone-number-validator
function telephoneCheck(str) {
  /*
  STEP:
  1. Split passed string and store into array.
  2. Removecharacters except numbers or brackets,dash.
  3. Test if non-numeric char is included or not.
  4. Check the number range from 10 to 11.
  5. In case 11 numbers, first number should be 1.
  */

  // If non number or non accepted characher exists, return false.
  if (/[^0-9|\-|\(\d+\)|\s]/.test(str)) {
    return false;
  }

　// bracket should be paired with holding 3 numbers
  if (/\(|\)/.test(str) && !/\(\d\d\d\)/.test(str)) {
    return false;
  }

  str = str.replace(/(\d)(\-)(\d)/g, '$1 $3');
  let arr = str.replace(/\(|\)/g, '').split(' ');

  if (arr.length < 3) {
    arr = [ arr.join('') ];
    if (arr[0].length == 10) {
      return true;
    }
    if (arr[0].length < 9) {
      return false;
    }
  }

  if (arr.length == 1 && arr[0].length == 10) {
    return true;
  }

  if (arr.length == 1 && arr[0].length == 11 
      && arr[0].charAt(0) != '1') {
    return false;
  }

  if (arr.length == 4 && parseInt(arr[0]) != 1) {
    return false;
  }

  return true;
}

telephoneCheck("(275)76227382");