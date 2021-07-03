/*
 * @Author: xiaohuolong
 * @Date: 2020-07-26 14:55:43
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-26 15:08:42
 * @FilePath: /study-demo/node-demo/game-demo/index.js
 */ 
const game = require('./game')
let count = 0
process.stdin.on('data', e => {
    const playAction = e.toString().trim()
    count += game(playAction)
    if(count > 3) {
        console.log(`你太屌了，不玩了`)
        process.exit()
    }
    if(count < -3) {
        console.log(`你太菜了，不玩了`)
        process.exit()
    }
})