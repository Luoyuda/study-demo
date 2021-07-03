/*
 * @Author: xiaohuolong
 * @Date: 2020-01-06 10:17:57
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-06-05 10:50:12
 * @FilePath: /study-demo/module/CommonJS/b.js
 */ 
const {a, b} = require('./a');
a() //a
module.exports.b = () => {
    console.log('b')
    a() //a
}
module.exports = () => {
    console.log('b')
    a() //a
}