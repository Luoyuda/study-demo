/*
 * @Author: xiaohuolong
 * @Date: 2020-07-26 14:48:57
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-26 14:53:27
 * @FilePath: /study-demo/node-demo/common/a.js
 */ 
const b = require('./b')
const c = require('./c')

console.log(b)
console.log(c)
// 因为是同一个引用，改动后会同步改动
c.print() // 3
c.c = 1
c.print() // 1