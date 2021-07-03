/*
 * @Author: xiaohuolong
 * @Date: 2020-07-26 14:49:02
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-26 14:51:43
 * @FilePath: /study-demo/node-demo/common/b.js
 */ 
exports.b = 1
// 会被覆盖
module.exports = {
    b: 2
}