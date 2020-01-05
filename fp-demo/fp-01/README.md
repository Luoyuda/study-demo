## 函数式编程是什么
函数式编程一种强调以函数为主的 **软件开发风格**，它的目标是抽象作用于数据之上的控制流和操作，从而在系统中 **消除副作用** 以及 **减少对状态的依赖**。

##  函数式编程核心思想
> 面向对象编程 (OO) 通过封装变化使得代码容易理解
> 函数式编程 (FP) 通过最小化变化使得代码容易理解

## 函数式编程的基本概念
### 声明式编程
* 声明式编程：将程序的描述跟求值进行分离，更加关注如何用各类表达式来描述程序逻辑
* 命令式编程：具体的告诉计算机如何执行某个任务
```javascript
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
```
### 纯函数
* 纯函数：指没有副作用和状态变化的函数，仅依赖于输入提供一个可以预测的值。
* incrCount：依赖于外部变量 count，一旦其他地方更改了 count，状态则变得不可预测
* incr：则根据输入，且无引用外部变量，每一次执行我们都可以准确预测输出，且没有副作用，也不产生状态变化
```javascript
var count = 0;
const incrCount = () => ++count
const incr = count => ++count
```
### 引用透明
* 引用透明：如果一个函数对于相同输入产生相同的结果，那么可以说其是引用透明的
* incrCount 引用了外部变量，所以它的值依赖于外部变量，而不是输入，所以不是引用透明的，要将其变得可控，需要将其改造成 incr
* incr 永远依赖于传入的变量，可以说这个函数是引用透明的，
### 不可变性
* 不可变性：输入的变量在执行完函数之后，依然保持着原有的样子。
* 比如上述代码中 array ，在 map 函数执行结束后，并没有对其产生副作用。

## 函数式编程的优点
* 使任务分解成粒度更小的函数单元
  * 模块化单元分解成多个逻辑子任务
  * 保持每个子任务都拥有单一的目的（单一职责原则）
  * 使用组合，组合所有逻辑子任务，最终完成整个程序
  * 例如：找到大象放进冰箱
    ```javascript
    const find = item => console.log(`find ${item}`) || item
    const into = item => console.log(`put ${item} into`) || item
    const eat = item => console.log(`eat ${item}`) || item
    const run = (...funcs) => (item) => {
        funcs.reduce((prev, func) => func(prev), item)
    }
    run(find, into)('elephant')
    // find elephant
    // put elephant into
    run(find, eat, into)('apple')
    // find apple
    // eat apple
    // put apple into
    ```
* 使用流氏的调用链来处理数据
* 通过响应式的范式来降低事件驱动代码的复杂性
