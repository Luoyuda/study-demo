//a.js
//导出变量
export var a = 1
//导出函数
export function b(){

}
//导出类
export class C {
	constructor(){

	}
}
var d = 100
//导出对象
export {
	d
}
//重命名导出
export { d as e}
//默认导出，一个模块只能有一个默认导出
export default d