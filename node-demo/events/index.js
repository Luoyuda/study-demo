/*
 * @Author: xiaohuolong
 * @Date: 2020-07-27 18:30:12
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-27 23:32:38
 * @FilePath: /study-demo/node-demo/events/index.js
 */ 
const { EventEmitter } = require('events')
const emitter = new EventEmitter()
// emitter.getMaxListeners(): number
// 获取最大监听数
console.log(emitter.getMaxListeners()) // 10

// emitter.setMaxListeners(n: number): internal.EventEmitter
// 设置最大监听数
// 超过时提示 (node:2496) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 2 吃饭啦 listeners added. Use emitter.setMaxListeners() to increase limit
emitter.setMaxListeners(1) // emitter.getMaxListeners(): 1

// emitter.on/addListener(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 监听事件
emitter.on('eat', (a, b) => {
    console.log(`${a} 喊 ${b} 吃饭啦`)
    // 箭头函数不会指向实例
    console.log(this)
})
emitter.addListener('eat', function(a, b){
    console.log(`${a} 喊 ${b} 吃饭啦`)
    // this 指向 emitter
    console.log(this)
})

// emitter.once(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 只监听一次事件
emitter.once('eat', function(a, b){
    console.log(`我只叫一次`)
})

// 异步响应
emitter.on('eat', (a, b) => {
    console.log('异步')
    setImmediate(() => {
        console.log('异步-setImmediate')
    })
    setTimeout(() => {
        console.log('异步-setTimeout')
    })
    process.nextTick(() => {
        console.log('异步-nextTick')
    })
})

// emitter.prependListener/prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 在监听事件响应列表开头追加监听事件
emitter.prependListener('eat', function(...args){
    console.log('prepend')
    console.log(args)
})

// emitter.listenerCount(type: string | symbol): number
// 查看监听事件数
console.log(emitter.listenerCount('eat')) // 5

// emitter.listeners(event: string | symbol): Function[]
// 获取某个事件的监听回调
const listeners = emitter.listeners('eat')

// emitter.off/removeListener/removeAllListeners(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 删除某个事件的某个监听回调/所有
emitter.off('eat',listeners[0])
emitter.removeListener('eat',listeners[1])
emitter.removeAllListeners('eat')

// emitter.emit(event: string | symbol, ...args: any[]): boolean
// 触发事件
emitter.emit('eat', 'a', 'b') // a 喊 b 吃饭啦
emitter.emit('eat', 'a', 'b') // a 喊 b 吃饭啦


function Plan(){
    EventEmitter.call(this)
}
// 继承 EventEmitter 类
Object.setPrototypeOf(Plan.prototype, EventEmitter.prototype)
Object.setPrototypeOf(Plan, EventEmitter)

const plan = new Plan()

const planRun = {
    '6:00' : function(){
        console.log('六点起床啦')
    },
    '7:00' : function(){
        console.log('七点出门啦')
    }
}

Object.keys(planRun).forEach(event => {
    plan.on(event, planRun[event])
})

const sleep = async (s) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, s*1000)
    })
}

const doSomeThings = async () => {
    plan.emit('6:00')
    await sleep(2)
    plan.emit('7:00')
}

doSomeThings() // 六点起床啦 两秒后 七点出门啦