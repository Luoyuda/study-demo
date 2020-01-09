## JavaScript 的函数
函数是函数式编程中的工作单元和中心。函数是任何可调用 `()` 操作求值的表达式。
在 `JavaScript` 的世界中，函数的两个重要特性：一等的和高阶的。
### 一等函数
一等的指的是语言层面上将函数视为真是的对象。
1. 作为匿名函数或 `lambda` 表达式给变量赋值
    ```javascript
    let func1 = function(e){}
    let func2 = e => e
    ```
2. 作为成员方法给对象属性赋值
    ```javascript
    const obj = {
        func: e => e
    }
    ```
3. 可以作为构造函数进行实例化
   ```javascript
   const a = new func1()
   ```
### 高阶函数
函数还可以将其他函数作为参数进行传递，或是有其他函数进行返回，这就是高阶函数。比如数组原型方法上的 `map` 方法接收一个函数作为参数，`bind` 方法可以返回一个函数
```javascript
console.log([1,2,3].map(item => item*2))
const log = function(a){
    console.log(`this.a=${this.a} - a=${a}`)
}
log.bind({a:1},2)()
var array = [xiaYu, deYuan, daQing, meiMei, daSheng]
// 找出所有地址为C且学校为B的小伙子
// 命令式的写法
const getListByAddressAndSchool = (address, school, people) => {
    var result = []
    for (let index = 0; index < people.length; index++) {
        const student = people[index];
        if(student.address == address && student.school == school){
            result.push(student)
            // console.log(student)
        }
    }
    return result
}
console.log(getListByAddressAndSchool('C','B', array))

// 函数式的写法
const isC = student => student.address == 'C'
const isB = student => student.school == 'B'
console.log(array.filter(isC).filter(isB))
```
### 函数调用类型
1. 作为全局函数调用
2. 作为方法调用
3. 作为构造函数跟 `new` 一起使用，返回一个新创建的对象引用

### 闭包
闭包：可以能够在函数声明过程中将环境信息与所属函数绑定在一起的数据结构。简单点来说，就是可以访问到自由变量的函数就叫闭包。
```javascript
// 闭包
const addCount = (count) => (i) => {
    count = i + count
    return count
}
// 传入 count
const addOne = addCount(1) // count = 1
// count+i 虽然addCount这个方法已经执行，但后续仍然能访问到变量count
console.log(addOne(2)) // count = 3
console.log(addOne(4)) // count = 7
// 闭包可以访问到整个作用域链上的所有变量
const outParams = 'outParams'
const logParams = (params) => (nowParams) => console.log(`${outParams}-${params}-${nowParams}`)
logParams('params')('nowParams') // outParams-params-nowParams
```
### 作用域
1. 全局作用域：任何对象和变量在脚本最外层声明都会成为全局作用域的一部分。
    ```javascript
    var globalVal = 'global'
    function getGlobalVal(){
        console.log(globalVal)
    }
    getGlobalVal()
    ```
2. 函数作用域：目前适用的作用域机制，在函数声明时，任何变量都是局部且外部不可见的，且函数返回后声明的局部变量会被删除
   1. 访问变量时，作用域链的机制
      1. 先检查当前作用域是否存在此变量
      2. 检查父作用域是否存在此变量
      3. 直到最外层作用域，如果没有，返回undefined
    ```javascript
    function getVal(){
        var localVal = 'local'
        !(function(){
            var innerVal = 'inner'
            console.log(`${globalVal}-${localVal}-${innerVal}`)
        }())
    }
    getVal()
    ```
3. 块级作用域（ES6），在代码块中声明的变量，离开代码块后会被回收
    ```javascript
    if(true){
        var a = 1
        let b = 1
        const c = 1
    }
    console.log(a) //1
    console.log(b) // 报错
    console.log(c) // 报错
    ```
