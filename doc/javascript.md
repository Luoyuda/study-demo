## ES6

### let const

1. 块级作用域
2. 禁止重复声明
3. 不存在变量提升
4. const 内容只读禁止修改，引用类型存的指针

### 解构赋值

解构对象时需要指定键值名称

```js
let [a, b, c] = [1, 2, 3]
```

### 箭头函数

```js
a = () => {}
```

#### 跟普通函数区别

1. 没有this！需要通过查找作用域链获取this
2. 没有arguments
3. 不能new
4. 没有原型

### 函数参数

#### 参数默认值

带默认值的参数需要放在入参的后面

```js
var a = function(b = 1) {console.log(b)}
a(2) // 2
a() // 1
```

#### rest参数（剩余参数）

```js
function a(...c){ console.log(c) }
a(1,2,3) // [1,2,3]
```

### 数组

#### … 扩展运算符

用于展开一个数组或者对象

```js
console.log(...[1,2,3]) // 1 2 3 
console.log({...{a:1}}) // { a:1 }
```

#### from/keys/values/entries

```js
// from
// 将类数组 和 可遍历对象转化成数组
Array.from({0:1,1:2,3:3,length: 4}) // [1,2,,3]
// keys/values/entries
// 返回一个遍历器对象，通过for ... of 实现遍历
var a = ['1', '2', '3']
for(let index of a.keys()){
    console.log(index) // 0 1 2
}
for(let value of a.keys()){
    console.log(value) // '1' '2' '3'
}
for(let arr of a.entries()){
    console.log(arr) // [0, '1'] [1, '2'] [2, '3']
}
```

### 对象

1. 允许变量名简写属性名
2. 允许字面量定义对象时使用表达式
3. assign 将原对象复制到目标对象中(浅复制)
4. 可以被for of 遍历

### symbol

新增的原始数据类型，表示独一无二的值

应用：消除魔术字符串，作为私有变量名

### Set

集合，所有成员都是唯一的，不存在重复的成员

```js
const set = new Set()
// 方法
set.add(1)
set.add(2)
set.add(1)
set.has(1) // true
set.delete(1)
set.has(1) // false
set.add(1)
set.clear()
set.has(1) // false
set.has(2) // false
// 遍历
set.forEach(item => console.log(item)) // 1 2
for(let key of set.keys()) { console.log(key) } // 1 2
for(let val of set.values()) { console.log(val) } // 1 2
for(let val of set.entries()) { console.log(val) } // [1, 1] [2, 2]
```

### Map

键值对的集合

```js
const map = new Map()
// 方法
map.set('a', 'A')
map.set('b', 'B')
map.set('a', 'A1')
map.get('a') // 'A1'
map.has('a') // true
map.delete('a')
map.has('a') // false
map.get('a') // undefined
map.clear()
map.has('b') // false
// 遍历
for(let key of map.keys()) { console.log(key) } // a b
for(let val of map.values()) { console.log(val) } // A B
for(let val of map.entries()) { console.log(val) } // ['a', 'A'] ['b', 'B']
map.forEach(item => console.log(item)) // A B
```

### Proxy

用于修改某些操作的默认行为，类似于一个拦截器

- **get(target, propKey, receiver)**：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
- **set(target, propKey, value, receiver)**：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
- **has(target, propKey)**：拦截`propKey in proxy`的操作，返回一个布尔值。
- **deleteProperty(target, propKey)**：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
- **ownKeys(target)**：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- **getOwnPropertyDescriptor(target, propKey)**：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
- **defineProperty(target, propKey, propDesc)**：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **preventExtensions(target)**：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- **getPrototypeOf(target)**：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
- **isExtensible(target)**：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
- **setPrototypeOf(target, proto)**：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **apply(target, object, args)**：拦截 Proxy 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
- **construct(target, args)**：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

### Promise

#### 特点

* 状态不受外界影响，三种状态
  * pending(进行中)
  * fulfilled(完成)
  * rejected(失败)

* 一旦决定就不会改变

#### 缺点

* 立即执行，且无法取消
* 不设置错误回调函数，无法抛出错误
* 无法预测进行到哪一阶段

#### 用法

* then(): 状态改变后到回调函数，返回一个新的 promise 实例
* catch(): 捕获异常
* Promise.all(): 全部异步操作成功后才返回成功，否则返回失败
* Promise.race():全部异步操作都失败后才返回失败

### Generator

Generator 函数是 ES6 提供的一种异步编程解决方案

Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

```js
function* gen() {
  yield 1;
  yield 2;
  return 3;
}
var a = gen()
a.next() // { value:1, done: false }
a.next() // { value: 2, done: false }
a.next() // { value: 3, done: true }
a.next() // { value: undefined, done: true }
```

### Async

Generator+co 的语法糖

```js
function timer(time) {
    return new Promise(res => {
        setTimeout(() => {
            console.log(`${time}s`)
            res()
        }, time*1000)
    })
}
// 同步
var fetchData = async function () {
    var r1 = await timer(1);
    var r2 = await timer(2);
		console.log('end')
};
fetchData() // 1s 2s end
// await 可能会阻塞，具体要看场景使用
// 并发写法
var fetchData = async function () {
    console.time('fetch')
    var r1 = timer(1);
    var r2 = timer(2);
    await r1
    await r2
    console.timeEnd('fetch')
};
// 通用 catch 方法
function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => [err]);
}
```

### 异步解决方案

1. callback ：回调地狱
2. Promise：比回调地狱好看点，但是代码冗余，状态决定后无法改变
3. Generator + co：用同步方式写异步操作，需要额外的执行器co 辅助才能自动执行
4. async / await： Generator + co的语法糖，兼容性怎么样

### class

类，面向对象

* 构造函数 constructor
* 继承 extend super()
* 静态方法： 不会被实例继承

