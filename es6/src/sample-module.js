"use strict";
const capitalizeString = (string) => {
  if (typeof window === 'undefined') {
    console.log('capitalizeString called!');
  } else {
    alert('capitalizeString called!');
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const foo = "bar";
// exportを使って、エクスポートできる関数であることを宣言する
export { capitalizeString, foo } //How to export functions.

