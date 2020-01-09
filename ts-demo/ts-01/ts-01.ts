/** 
 * 布尔值
 * boolean
*/
let isDone: boolean = false
/** 
 * 数值型
 * number
*/
let six: number = 6
let infinity: number = Infinity
/** 
 * 字符串
 * string
*/
let str: string = '123'
let Str: string = `Str = ${str}`
/** 
 * 空值
*/
function consoleMsg() : void{
    console.log('msg')
}
consoleMsg()
/** 
 * undefined
 * null
*/
let u: undefined
let n: null = null
console.log(typeof u)
console.log(typeof n)
/**
 * Symbol
 */
let sym3 = Symbol("key");
console.log(sym3)
/**
 * 任意类型 
 * any
 * 可以赋值为任意类型的类型
 * 
*/
let anyThing: any = 'hello'
anyThing = 10
/** 
 * 类型推论
 * 在没有明确指定类型的时候，会通过定义的值推断其类型；
 * 如果没有赋值，则会被推断成 any 类型
*/
var num
num = 10
num = '10'
/** 
 * 联合类型
 * 表示值可以为多种类型中的一种，用 | 分隔
*/
var num2: number | string | boolean = '123'
num2 = 1
num2 = true

/** 
 * 对象类型
 * 接口
 * 接口是对行为的抽象表达，具体由类去实现，
 * 实现需要严格按照设定的接口属性进行实例化
 * 属性配置
 * 1. 可选属性 在接口属性后加上 ?
 * 2. 任意属性 [propName: string]
 * 3. 只读属性 只能在创建的时候被赋值，readonly
 * 例如 一个人的对象的接口表达如下
*/
interface Person{
    readonly id: number,
    name: string,
    age?: number | undefined,
    [propName: string]: string | number | undefined
}
let curry: Person = {
    id: 1,
    name: 'Curry',
    age: 30,
    a: '1'
}
console.log(curry)

/** 
 * 数组类型
 * 1.「类型 + 方括号」表示法
 * 2. 数组泛型  Array<number>
 * 3. 接口表示数组
*/
interface NumberArray {
    [index: number]: number;
}
var numbers: number[] = [1,1,1,1,3]
var number1: Array<number> = [1,1,1,1,3]
var number2: NumberArray = [1,1,1,1,3]
console.log(numbers)
console.log(number1)
console.log(number2)
var strings: string[] = ['1','1','1','1','3']
console.log(strings)
var humans: Person[] = [curry, { id:2, name:'c' }]
console.log(humans)

/** 
 * 函数声明
 * 1. 函数声明
 * 2. 函数表达式
 * 参数选项
 * 1. 可选参数 ?
 * 2. 参数默认值 =
 * 3. 剩余参数 ...
*/
function sum(x: number, y: number): number{
    return x + y
} 
//注意这里的左边 => 是ts中是用来表示输入类型 而右边的 => 是 es6 的箭头函数
let sum2: (x: number, y: number) => number = (x, y) => x + y
console.log(sum(1, 2))
console.log(sum2(2, 2))
// 接口也可以表示函数的形状
interface Say {
    (x?: string, y?: string): string
}
let say: Say = (x: string = 'Hello', y) => `${x}-${y || 'MI'}`
console.log(say('Hi', 'XiaYu'))
console.log(say())
let push: (array: number[], ...item: number[]) => number[] = (arr, ...items) => items.map(item => arr.push(item))
console.log(push([], 1, 2, 4, 3))

// 重载 重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。
function reverse(x: number): number | string 
function reverse(x: string): number | string 
function reverse(x:any): number | string {
    if (!(<string>x).length) {
        return Number(x.toString().split('').reverse().join(''));
    }else {
        return x.split('').reverse().join('');
    }
}

console.log(reverse(123), reverse('456'))

type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}

console.log(getName('1323'))
console.log(getName(()=>'222'))

/** 
 * 元组
 * 元组（Tuple）合并了不同类型的对象的数组。
*/
let tuple: [string , number | string]
tuple = ['1', 1]

/** 
 * 枚举
 * Enum 用于取值被限定在一定范围内的场景
*/
enum Status { load, unload }
console.log(Status['load'])

// 类型断言：可以用来手动指定一个值的类型。断言成一个联合类型中不存在的类型是不允许的
const getLenByList = (str: string | number): number => {
    if((str as string).length){
        return (<string>str).length
    }else{
        return str.toString().length
    }
}
console.log(getLenByList(123321))
console.log(getLenByList('123321'))

/**
 * Never 类型表示的是那些永不存在的值的类型
 */
const error = (msg:string):never => {
    throw new Error(msg)
}
error('我是个错误')