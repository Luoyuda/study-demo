/*
 * @Author: xiaohuolong
 * @Date: 2020-01-06 10:17:57
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-06-05 10:50:25
 * @FilePath: /study-demo/module/CommonJS/c.js
 */ 
const bf = require('./b');
var {a, b, bCount} = require('./a');
a() //a
b()
console.log(bCount)
bf() //b
// b() 
