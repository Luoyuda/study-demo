/*
 * @Descripttion: Bug是不可能有的，这辈子都不可能有的🐶
 * @version: 
 * @Author: 陈夏雨
 * @Date: 2020-01-16 16:09:37
 * @LastEditors  : 陈夏雨
 * @LastEditTime : 2020-01-20 15:18:11
 */
const getVal = <T>(item:T):T => item

console.log(getVal(123))
console.log(getVal("123"))
console.log(getVal([1,2,3,4]))

const useVal = <T>(item:T[]):T[] => {
    console.log(item.length);
    return item
}

console.log(useVal([1,1,'2']))
console.log(useVal([1,1,2,41,'sda']))
console.log(useVal([1,2,3,4]))

interface fn {
    <T>(arg: T): T;
}

const getVal2: fn = <T>(item:T):T => {
    return item
}
console.log(getVal2('123'))
console.log(getVal2(123))