/*
 * @Descripttion: Bug是不可能有的，这辈子都不可能有的🐶
 * @version:
 * @Author: 陈夏雨
 * @Date: 2020-01-16 16:09:37
 * @LastEditors  : 陈夏雨
 * @LastEditTime : 2020-01-20 15:18:11
 */
var getVal = function (item) { return item; };
console.log(getVal(123));
console.log(getVal("123"));
console.log(getVal([1, 2, 3, 4]));
var useVal = function (item) {
    console.log(item.length);
    return item;
};
console.log(useVal([1, 1, '2']));
console.log(useVal([1, 1, 2, 41, 'sda']));
console.log(useVal([1, 2, 3, 4]));
var getVal2 = function (item) {
    return item;
};
console.log(getVal2('123'));
console.log(getVal2(123));
