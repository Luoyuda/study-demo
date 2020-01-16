"use strict";
/**
 * 布尔值
 * boolean
*/
let isDone = false;
/**
 * 数值型
 * number
*/
let six = 6;
let infinity = Infinity;
/**
 * 字符串
 * string
*/
let str = '123';
let Str = `Str = ${str}`;
/**
 * 空值
*/
function consoleMsg() {
    console.log('msg');
}
consoleMsg();
/**
 * undefined
 * null
*/
let u;
let n = null;
console.log(typeof u);
console.log(typeof n);
/**
 * Symbol
 */
let sym3 = Symbol("key");
console.log(sym3);
/**
 * 任意类型
 * any
 * 可以赋值为任意类型的类型
 *
*/
let anyThing = 'hello';
anyThing = 10;
/**
 * 类型推论
 * 在没有明确指定类型的时候，会通过定义的值推断其类型；
 * 如果没有赋值，则会被推断成 any 类型
*/
var num;
num = 10;
num = '10';
/**
 * 联合类型
 * 表示值可以为多种类型中的一种，用 | 分隔
*/
var num2 = '123';
num2 = 1;
num2 = true;
let curry = {
    id: 1,
    name: 'Curry',
    age: 30,
    a: '1'
};
console.log(curry);
var numbers = [1, 1, 1, 1, 3];
var number1 = [1, 1, 1, 1, 3];
var number2 = [1, 1, 1, 1, 3];
console.log(numbers);
console.log(number1);
console.log(number2);
var strings = ['1', '1', '1', '1', '3'];
console.log(strings);
var humans = [curry, { id: 2, name: 'c' }];
console.log(humans);
/**
 * 函数声明
 * 1. 函数声明
 * 2. 函数表达式
 * 参数选项
 * 1. 可选参数 ?
 * 2. 参数默认值 =
 * 3. 剩余参数 ...
*/
function sum(x, y) {
    return x + y;
}
//注意这里的左边 => 是ts中是用来表示输入类型 而右边的 => 是 es6 的箭头函数
let sum2 = (x, y) => x + y;
console.log(sum(1, 2));
console.log(sum2(2, 2));
let say = (x = 'Hello', y) => `${x}-${y || 'MI'}`;
console.log(say('Hi', 'XiaYu'));
console.log(say());
let push = (arr, ...items) => items.map(item => arr.push(item));
console.log(push([], 1, 2, 4, 3));
function reverse(x) {
    if (!x.length) {
        return Number(x.toString().split('').reverse().join(''));
    }
    else {
        return x.split('').reverse().join('');
    }
}
console.log(reverse(123), reverse('456'));
function getName(n) {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
console.log(getName('1323'));
console.log(getName(() => '222'));
/**
 * 元组
 * 元组（Tuple）合并了不同类型的对象的数组。
*/
let tuple;
tuple = ['1', 1];
/**
 * 枚举
 * Enum 用于取值被限定在一定范围内的场景
*/
var Status;
(function (Status) {
    Status[Status["load"] = 0] = "load";
    Status[Status["unload"] = 1] = "unload";
})(Status || (Status = {}));
console.log(Status['load']);
// 类型断言：可以用来手动指定一个值的类型。断言成一个联合类型中不存在的类型是不允许的
const getLenByList = (str) => {
    if (str.length) {
        return str.length;
    }
    else {
        return str.toString().length;
    }
};
console.log(getLenByList(123321));
console.log(getLenByList('123321'));
/**
 * Never 类型表示的是那些永不存在的值的类型
 */
const error = (msg) => {
    throw new Error(msg);
};
error('我是个错误');
