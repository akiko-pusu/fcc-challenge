"use strict";
// import { capitalizeString, foo } from "./sample-module";
import * as SampleModule from "./sample-module.js";
const test = SampleModule.capitalizeString("hello!");
console.log(test);
console.log(`${SampleModule.foo} : ${test}`);


// export defaultのテスト
import subtract from "./export-default.js";
console.log(`Subtract 2 from 4 is:  ${subtract(4, 2)}`);
