/*
 * @Author: xiaohuolong
 * @Date: 2020-07-27 10:12:07
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-27 12:17:17
 * @FilePath: /study-demo/node-demo/buffer/index.js
*/ 
const log = console.log
// Buffer.from(arrayBuffer: ArrayBuffer | SharedArrayBuffer, byteOffset?: number, length?: number): Buffer
// 创建Buffer
// 创建一个 123 Buffer
const buf = Buffer.from('123')
log(buf) // <Buffer 31 32 33>
log(buf.toString()) // 123
// 创建一个 [1,2,3] Buffer
const buf1 = Buffer.from([1,2,3])
log(buf1) // <Buffer 01 02 03>
log(buf1.toJSON()) // { type: 'Buffer', data: [ 1, 2, 3 ] }

// Buffer.alloc(size: number, fill?: string | number | Buffer, encoding?: BufferEncoding): Buffer
// 创建一个长度为 10、且用 '1' 填充的 Buffer。 
const buf3 = Buffer.alloc(10, '1')
log(buf3) // <Buffer 31 31 31 31 31 31 31 31 31 31>
log(buf3.toJSON()) // { type: 'Buffer', data: [ 49, 49, 49, 49, 49, 49, 49, 49, 49, 49 ] }

// Buffer.byteLength(string: string | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array | DataView | ArrayBuffer | SharedArrayBuffer, encoding?: BufferEncoding): number
// Buffer长度
log(Buffer.byteLength(buf)) // 3
log(buf.length) // 3

// Buffer.isBuffer(obj: any): boolean
// 是否 Buffer
log(Buffer.isBuffer(buf)) // true
log(Buffer.isBuffer({})) // false

// Buffer.concat(list: Uint8Array[], totalLength?: number): Buffer
// 拼接多个 Buffer 对象
const buf2 = Buffer.concat([Buffer.from('你'), Buffer.from('真'), Buffer.from('帅')])
log(buf2) // <Buffer e4 bd a0 e7 9c 9f e5 b8 85>

// buffer.length 内存中分配给buf的字节数
log(buf2.length) // 9

// buffer.toString(encoding?: string, start?: number, end?: number): string
// 根据encoding指定的字符编码将buf解码成字符串
log(buf2.toString()) // 你真帅

// buffer.fill(value: string | number | Uint8Array, offset?: number, end?: number, encoding?: BufferEncoding) : this
// 用value填充buffer, 如果没有指定offset与 end，则填充整个buffer
log(buf2.fill('1')) // <Buffer 31 31 31 31 31 31 31 31 31>
log(buf2.toString()) // 111111111

// buffer.equals(otherBuffer: Uint8Array): boolean 
// 判断两个buffer是否相等
log(buf2.equals(Buffer.alloc(9, '1'))) // true
log(buf2.toString()) // 111111111

// buffer.indexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number
// 是否包含参数，包含则返回所在下标，不包含返回-1
log(buf2.indexOf('1')) // true
log(buf2.indexOf(1)) // false
