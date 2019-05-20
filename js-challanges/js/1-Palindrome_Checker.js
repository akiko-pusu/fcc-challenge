// Ref. https://learn.freecodecamp.org/javascript-algorithms-and-data-structures/javascript-algorithms-and-data-structures-projects/palindrome-checker
function palindrome(str) {
  /* 
    Step:
    1. Remove non alphanumeric chars.
    2. Change all chars to lowercase. 
    3. reverse and join.
    4. compare original and converted.
  */
  let original = str.toLowerCase().replace(/([^a-zA-Z0-9])/g, '');
  let converted = original.split('').reverse().join('');

  return converted === original;
}
    
palindrome("A man, a plan, a canal. Panama");