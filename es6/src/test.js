"use strict";
import { capitalizeString, foo } from "./sample-module";
const test = capitalizeString("hello!");
console.log(test);
console.log(`${foo} : ${test}`);
