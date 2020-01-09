/*
 * @Descripttion: Bug是不可能有的，这辈子都不可能有的🐶
 * @version: 
 * @Author: 陈夏雨
 * @Date: 2020-01-09 22:48:57
 * @LastEditors  : 陈夏雨
 * @LastEditTime : 2020-01-10 00:29:08
 */
console.log([1,2,3].map(item => item*2))
const log = function(a){
    console.log(`this.a=${this.a} - a=${a}`)
}
log.bind({a:1},2)()
class Person {
    constructor(name){
        this._name = name
    }
    get name(){
        return this._name
    }
    set name(name){
        this._name = name
    }
    get address(){
        return this._address
    }
    set address(address){
        this._address = address
    }
    toString(){
        return `I am ${this._name}, from ${this._address}`
    }
}

class Student extends Person{
    constructor(name, school){
        super(name)
        this.school = school
    }
}

const xiaYu = new Student('xiaYu', 'A')
const deYuan = new Student('deYuan', 'B')
const daQing = new Student('daQing', 'A')
const meiMei = new Student('meiMei', 'B')
const daSheng = new Student('daSheng', 'F')
xiaYu.address = 'D'
deYuan.address = 'C'
daQing.address = 'D'
meiMei.address = 'C'
daSheng.address = 'C'
var array = [xiaYu, deYuan, daQing, meiMei, daSheng]
// 找出所有地址为C且学校为B的小伙子
// 命令式的写法
const getListByAddressAndSchool = (address, school, people) => {
    // var result = []
    for (let index = 0; index < people.length; index++) {
        const student = people[index];
        if(student.address == address && student.school == school){
            // result.push(student)
            console.log(student)
        }
    }
    // return result
}
console.time('1')
console.log(getListByAddressAndSchool('C','B', array))
console.timeEnd('1')

// 函数式的写法
const isC = student => student.address == 'C'
const isB = student => student.school == 'B'
console.time('2')
console.log(array.filter(isC).filter(isB).forEach(console.log))
console.timeEnd('2')

// 闭包
const addCount = (count) => (i) => {
    count = i + count
    return count
}
const addOne = addCount(1) // 传入 count
console.log(addOne(2)) // count+i 虽然addCount这个方法已经执行，但后续仍然能访问到变量count
console.log(addOne(4)) // 7
const outParams = 'outParams'
const logParams = (params) => (nowParams) => console.log(`${outParams}-${params}-${nowParams}`)
logParams('params')('nowParams')

// 作用域链
var globalVal = 'global'
function getGlobalVal(){
    console.log(globalVal)
}
getGlobalVal()

function getVal(){
    var localVal = 'local'
    !(function(){
        var innerVal = 'inner'
        console.log(`${globalVal}-${localVal}-${innerVal}`)
    }())
}
getVal()

if(true){
    var a = 1
    let b = 1
    const c = 1
}
console.log(a) //1
console.log(b) // 报错
console.log(c) // 报错