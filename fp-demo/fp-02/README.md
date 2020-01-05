## 函数式与面向对象的程序设计
### 在 JavaScript 中的实践
JavaScript 是一个很神奇的语言，它在设计之初就被融入了各种类型的血液，可以说它即是面向对象的，也是函数式的。
在 ES6 的版本总新增了许多更能配合函数式编程的特性，如箭头函数，迭代器，Promise
一个小例子来比较一下两者的不一样，通过查询不同地区不同学校的学生的两种实现方式来比较两者的差异
```javaScript
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

const xiaYu = new Student('xiaYu', 24, 'A')
const deYuan = new Student('deYuan', 22, 'B')
const daQing = new Student('daQing', 22, 'A')
const meiMei = new Student('meiMei', 26, 'B')
const daSheng = new Student('daSheng', 26, 'F')
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
```

### 差异
|       |函数式|面向对象|
|------|------------|------------|
|组合单元|函数|对象(类)|
|编程风格|声明式|命令式|
|数据和行为|独立且松耦合的纯函数|与方法耦合的类|
|状态管理|对象为不可变的值|通过实例方法改变对象|
|程序流控制|函数和递归|循环和条件|
|线程安全|可并发编程|难以并发编程|
|封装性|一切皆为不可变，不存在封装|需要保护数据的完整性|

尽管两者存在很大的差异，我们仍需要让他们互相结合，取其精华，去其糟粕。