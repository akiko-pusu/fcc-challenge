"use strict";
const capitalizeString = (string) => {
  string.charAt(0).toUpperCase() + string.slice(1);
}

const foo = "bar";
// exportを使って、エクスポートできる関数であることを宣言する
export { capitalizeString, foo } //How to export functions.

