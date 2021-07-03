/*
 * @Author: xiaohuolong
 * @Date: 2020-07-26 14:55:48
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-26 15:01:52
 * @FilePath: /study-demo/node-demo/game-demo/game.js
 */ 
module.exports = function(playAction){
    let random = Math.random() * 3
    let action = 'rock'
    if(random < 1){
        action = 'rock'
    }else if(random > 2){
        action = 'scissor'
    }else{
        action = 'paper'
    }
    console.log(`我出了 ${playAction}`)
    console.log(`电脑出了 ${action}`)
    if(playAction == action){
        console.log('平')
        return 0
    }else if(
        (playAction == 'rock' && action == 'scissor') ||
        (playAction == 'scissor' && action == 'paper') ||
        (playAction == 'paper' && action == 'rock') 
    ){
        console.log('你赢了')
        return 1
    }else{
        console.log('你输了')
        return -1
    }
}