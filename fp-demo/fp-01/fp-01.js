/*
 * @Descripttion: Bug是不可能有的，这辈子都不可能有的🐶
 * @version: 
 * @Author: 陈夏雨
 * @Date: 2020-01-05 14:19:18
 * @LastEditors  : 陈夏雨
 * @LastEditTime : 2020-01-05 14:59:58
 */
/*
* 声明式编程：将程序的描述跟求值进行分离，更加关注如何用各类表达式来描述程序逻辑
* 命令式编程：具体的告诉计算机如何执行某个任务
*/
var array = [1, 2, 3, 4, 5]
// 命令式
for (let i = 0; i < array.length; i++) {
    array[i] = array[i] * 2
}
console.log(array) // [ 1, 2, 3, 4, 5 ]
// 声明式
var array = [1, 2, 3, 4, 5]
const multiply = (val, num) => val * num
const map = (array, func) => {
    let result = []
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i]
        result.push(func(array[i], i))
    }
    return result
}
let result = map(array, (item)=>multiply(item, 2))
// 用原生的 map
let result2 = array.map((item)=>multiply(item, 2))
console.log(result) // [ 1, 2, 3, 4, 5 ]
console.log(result2) // [ 1, 2, 3, 4, 5 ]
console.log(array) // [ 1, 2, 3, 4, 5 ]

/**
 * 纯函数：指没有副作用和状态变化的函数，仅依赖于输入提供一个可以预测的值。
 * incrCount 则依赖于外部变量 count，一旦其他地方更改了 count，状态则变得不可预测
 * incr 则根据输入，且无引用外部变量，每一次执行我们都可以准确预测输出，且没有副作用，也不产生状态变化
 */
var count = 0;
const incrCount = () => ++count
const incr = count => ++count

/**
 * 引用透明：如果一个函数对于相同输入产生相同的结果，那么可以说其是引用透明的
 * incrCount 引用了外部变量，所以它的值依赖于外部变量，而不是输入，所以不是引用透明的，要将其变得可控，需要将其改造成 incr
 * incr 永远依赖于传入的变量，可以说这个函数是引用透明的，
 */

/**
 * 不可变性：输入的变量在执行完函数之后，依然保持着原有的样子。
 * 比如上述代码中 array ，在 map 函数执行结束后，并没有对其产生副作用。
 */