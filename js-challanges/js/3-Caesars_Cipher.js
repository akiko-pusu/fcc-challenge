// https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/caesars-cipher
function rot13(str) { // LBH QVQ VG!
  /*
  STEP:
  0. Create a function to convert character followinf to POT13.
  1. Splitpassed string into array. 
  3. Convert each character via function
    (NOTE: non-alphabet character is not changed.)
  4. Join the converted array.
  */
  let arr = str.split('');
  return arr.map((char) => pot13(char)).join('');
}

function pot13(char) {
  let firstCode = 'A'.charCodeAt(0);
  let lastCode = 'Z'.charCodeAt(0);

  let charCode = char.charCodeAt(0);
  if (charCode < firstCode || charCode > lastCode) {
    return char;
  }

  let position = charCode - firstCode;
  let mod = (position + 13) % 26;
  return String.fromCharCode(firstCode + mod);
}

// Change the inputs below to test ('FREE CODE CAMP')
rot13("SERR PBQR PNZC");
