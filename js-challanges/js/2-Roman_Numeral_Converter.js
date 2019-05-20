// Ref. https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/roman-numeral-converter
function convertToRoman(num) {
  /*
  Step:
  1. Create mapping array table.
  2. Split the number by each place.
  3. Using switch - case statement to convert to roman number.
  4. Change converted array into string.
  */
  let place_arr = [
      ["I", "V"], // ones place and 5
      ["X", "L"], // 10s place and 50
      ["C", "D"], // 100s place and 500
      ["M", ""]   // 1000s place
  ];

  // store converted numbers
  let retval = [];

  // Exp. [5, 80, 300] (385)
  let parsed_num = convert_arr(num);

  for (let i = 0; i < parsed_num.length; i++) {
      let target = parsed_num[i];

      if (target == 0) { continue; }

      // Basic roman numberr for each place. 
      let base = place_arr[i][0];

      // Exp. 300 -> 3, 600 -> 6
      let count = target / Math.pow(10, i);
      let char = '';

      switch(true) {
          case count == 1:
              char = base;
              break;
          case count < 4:
              char = Array(count + 1).join(base);
              break;
          case count == 4:
              char = base + place_arr[i][1];
              break;
          case count == 5:
              char = place_arr[i][1];
              break;
          case count == 9:
              char = base + place_arr[i + 1][0];
              break;
          case count > 5:
              char = place_arr[i][1] + Array(count + 1 - 5).join(base);
              break;
      }
      retval.unshift(char);
  }
  return retval.join('');
}

// Split the number into array. exp. 315 => [5, 10, 300]
function convert_arr(num) {
  let divider = 1;
  let arr = [];
  while (divider <= num) {
      divider = divider * 10;
      let remainder = num % divider;
      arr.push(remainder);
      num = num - remainder; 
  }
  return arr;
}

convertToRoman(36);
