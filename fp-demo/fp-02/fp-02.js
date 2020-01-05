/*
 * @Descripttion: Bug是不可能有的，这辈子都不可能有的🐶
 * @version: 
 * @Author: 陈夏雨
 * @Date: 2020-01-05 23:22:50
 * @LastEditors  : 陈夏雨
 * @LastEditTime : 2020-01-06 00:12:06
 */
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
console.log(xiaYu)
console.log(deYuan)
console.log(daQing)
console.log(meiMei)
console.log(daSheng)
var array = [xiaYu, deYuan, daQing, meiMei, daSheng]
// 找出跟我同一个地区的小伙子
// 找出跟我同一个地区且同一所学校的小伙子
// 面向对象的写法
Person.prototype.inSameAddress = function(students) {
    var result = []
    for (let index = 0; index < students.length; index++) {
        const student = students[index];
        if(student.address == this.address){
            result.push(student)
        }
    }
    return result
}
Student.prototype.inSameAddressAndSchool = function(students) {
    var result = []
    var sameAddress = this.inSameAddress(students)
    for (let index = 0; index < sameAddress.length; index++) {
        const student = sameAddress[index];
        if(student.school == this.school){
            result.push(student)
        }
    }
    return result
}
console.log(xiaYu.inSameAddress(array))
console.log(deYuan.inSameAddress(array))
console.log(xiaYu.inSameAddressAndSchool(array))
console.log(deYuan.inSameAddressAndSchool(array))
// 函数式的写法
const selector = ({address, school}) => student => 
    (address ? student.address === address : true) && (school ? student.school === school : true)

const findStudentBy = (students, selector) => students.filter(selector)

console.log(
    findStudentBy(array, selector({
        address: 'C',
        school: 'F'
    }))
)

console.log(
    findStudentBy(array, selector(xiaYu))
)