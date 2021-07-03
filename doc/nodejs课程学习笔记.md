# node.js课程学习笔记

Node.js 是一个开源与跨平台的 JavaScript 运行时环境。

## 模块规范

通过  `require`  引入模块

````js
const a = require('a') // 引入 a 模块
````

通过 `exports` , `module.exports` 导出

```js
exports.a = 1
module.exports = {
  // 一般直接改变整个导出的内容
}
```

导出的模块其实是同一个引用，所以会存在变量污染问题，需要开发时注意不要改动到引用的变量

```js
// a.js
const b = require('./b')
const c = require('./c')

console.log(b)
console.log(c)
// 因为是同一个引用，改动后会同步改动
c.print() // 3
c.c = 1
c.print() // 1

// c.js
exports.c = 3
exports.print = function(){
    console.log(`c = ${exports.c} by c.js`)
}

// b.js
exports.b = 1
// 会被覆盖
module.exports = {
    b: 2
}
```

#### 剪刀石头布案例代码

```js
// index.js
const game = require('./game')
let count = 0
process.stdin.on('data', e => {
  	// 监听进程输入
    const playAction = e.toString().trim()
    count += game(playAction)
    if(count > 3) {
        console.log(`你太屌了，不玩了`)
        process.exit()
    }
    if(count < -3) {
        console.log(`你太菜了，不玩了`)
        process.exit()
    }
})
```

```js
// game.js
module.exports = function(playAction){
    let random = Math.random() * 3
    let action = 'rock'
    if(random < 1){
        action = 'rock'
    }else if(random > 2){
        action = 'scissor'
    }else{
        action = 'paper'
    }
    console.log(`我出了 ${playAction}`)
    console.log(`电脑出了 ${action}`)
    if(playAction == action){
        console.log('平')
        return 0
    }else if(
        (playAction == 'rock' && action == 'scissor') ||
        (playAction == 'scissor' && action == 'paper') ||
        (playAction == 'paper' && action == 'rock') 
    ){
        console.log('你赢了')
        return 1
    }else{
        console.log('你输了')
        return -1
    }
}
```

## 非阻塞I/O

I/O：input/output，系统的输入输出

阻塞I/O：系统在接收输入后到输出的时候，阻塞进程，不接收其他输入

非阻塞I/O：系统在接收输入后到输出的时候，不阻塞进程，可以接收其他输入

## nodejs架构

![image-20200726152806188](/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200726152806188.png)

应用层：   即 JavaScript 交互层，常见的就是 Node.js 的模块，比如 http，fs

V8引擎层：  即利用 V8 引擎来解析JavaScript 语法，进而和下层 API 交互

NodeAPI层：  为上层模块提供系统调用，一般是由 C 语言来实现，和操作系统进行交互 。

LIBUV层： 是跨平台的底层封装，实现了 事件循环、文件操作等，是 Node.js 实现异步的核心 

## nodejs事件循环

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200726160803945.png" alt="image-20200726160803945" style="zoom:50%;" />

1. **`timers` 阶段**: 这个阶段执行 `setTimeout(callback)` 和 `setInterval(callback)` 预定的 callback;

2. **`I/O callbacks` 阶段**: 此阶段执行某些系统操作的回调，例如TCP错误的类型。 例如，如果TCP套接字在尝试连接时收到 ECONNREFUSED，则某些* nix系统希望等待报告错误。 这将操作将等待在I/O回调阶段执行;

3. **`idle, prepare` 阶段**: 仅node内部使用;

4. **`poll` 阶段**: 获取新的I/O事件, 例如操作读取文件等等，适当的条件下node将阻塞在这里;

5. **`check` 阶段**: 执行 `setImmediate()` 设定的callbacks;

6. **`close callbacks` 阶段**: 比如 `socket.on(‘close’, callback)` 的callback会在这个阶段执行;

**每个阶段都有一个先入先出的（FIFO）的用于执行回调的队列，事件循环运行到每个阶段，都会从对应的回调队列中取出回调函数去执行，直到队列当中的内容耗尽，或者执行的回调数量达到了最大。然后事件循环就会进入下一个阶段，然后又从下一个阶段对应的队列中取出回调函数执行，这样反复直到事件循环的最后一个阶段。而事件循环也会一个一个按照循环执行，直到进程结束。**

Node事件循环中的异步队列包含两种队列：`macro`（宏任务）队列和 `micro`（微任务）队列。

- macro-task：`setTimeout`、`setInterval`、 `setImmediate`、`script（代码）`、 `I/O`操作...
- micro-task：`process.nextTick`、`new Promise().then()`...

## process.nextTick

- 执行机制：`process.nextTick`是用于在事件循环的下一次循环中调用回调函数的，将一个函数推迟到代码执行的下一个同步方法执行完毕，或异步事件回调函数开始执行时再执行
- 执行原理：`Node`每一次循环都是一个`tick`，每次`tick`，`Chrome V8`都会从时间队列当中取所有事件依次处理。遇到`nextTick`事件，将其加入事件队尾，等待下一次`tick`到来的时候执行

### 执行过程

node：microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200726201754821.png" alt="image-20200726201754821" style="zoom:50%;" />

浏览器：microtask的任务队列是每个macrotask执行完之后执行。

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200726201956156.png" alt="image-20200726201956156" style="zoom:50%;" />

## node常用模块

### global

包装模块的全局对象

* `module`：表示对本地模块的引用
* `require`：引入模块
* `exports`：`module.exports`的缩写，表示这个模块的输出

### buffer

#### 核心概念

Buffer 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。

Buffer 是类，是一种特殊的数据节藕，用于读取和操作二进制数据流，用于操作网络协议、数据库、图片、文件I/O等一些需要大量二进制数据的场景。

Buffer 创建时就已经确定大小，且无法调整，由C++层面提供内存分配

#### 使用

```js
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
```

#### 应用场景

1. I/O 操作
2. 压缩或解压功能
3. 加密解密

#### Buffer和Cache的区别

* 缓冲（Buffer）是用于处理二进制流数据，将数据缓冲起来，它是临时性的，对于流式数据，会采用缓冲区将数据临时存储起来，等缓冲到一定的大小之后在存入硬盘中。
* 缓存（Cache）我们可以看作是一个中间层，它可以是永久性的将热点数据进行缓存，使得访问速度更快。

### stream

在`node`当中`stream`是一种处理流数据的抽象接口，`stream`模块提供了一系列实现流的API

#### 为什么使用stream

一次性读取、操作大文件，内存和网络是“吃不消”的，因此要让数据流动起来，一点一点的操作。

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server8000 = http.createServer(function (req, res) {
    const fileName = path.resolve(__dirname, 'data.txt');
    // // 流的方式读取文件，不需要把文件全部读取了再返回，而是一边读取一边返回，数据通过管道流动给客户端
    let stream = fs.createReadStream(fileName);  // 这一行有改动
    stream.pipe(res); // 这一行有改动
});
server8000.listen(8000);

const server8001 = http.createServer(function (req, res) {
    const fileName = path.resolve(__dirname, 'data.txt');
    // 普通读取文件，遇到大文件，如果高并发的情况下，会使用大量内存
    fs.readFile(fileName, function (err, data) {
        res.end(data);
    });
});
server8001.listen(8001);
```

#### 流转过程

- data事件：用来监听stream数据的流入
- end事件：用来监听stream数据输入的完成
- pipe方法：用来做数据流转

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200727172708184.png" alt="image-20200727172708184" style="zoom:50%;" />

**stream从哪里来-soucre**

stream的常见来源方式有三种：

- 从控制台输入
- http请求中的request
- 读取文件

**连接水桶的管道-pipe**

从水桶管道流转图中可以看到，在`source`和`dest`之间有一个连接的管道`pipe`,它的基本语法是 source.pipe(dest) ，`source`和`dest`就是通过`pipe`连接，让数据从`source`流向了`dest`。

**stream到哪里去-dest**

stream的常见输出方式有三种：

- 输出控制台
- http请求中的response
- 写入文件

http请求和文件操作都属于IO ，即 stream 主要的应用场景就是处理IO ，这就又回到了stream的本质 —— 由于一次性IO操作过大，硬件开销太多，影响软件运行效率，因此将IO分批分段操作，让数据一点一点的流动起来，直到操作完成 。

#### 应用场景

##### http + fs

* `request`跟`response`本身就是个`stream`对象，可以直接使用`stream`的特性，`request`是`source`类型的，`response`则是`dest`类型
* `fs.createReadStream`来创建读取文件的`stream`对象
* `fs.createWriteStream`来创建写入文件的`stream`对象

```js
const server8000 = http.createServer((req, res) => {
    const method = req.method; // 获取请求方法
    if (method === 'GET') {
        const fileName = path.resolve(__dirname, 'data.txt');
        // 流的方式读取文件，不需要把文件全部读取了再返回，而是一边读取一边返回，数据通过管道流动给客户端
        let stream = fs.createReadStream(fileName);  
        stream.pipe(res); 
    } else if (method === 'POST'){
        var fileName = path.resolve(__dirname, 'data.txt')
        var writeStream = fs.createWriteStream(fileName)
        // 一边接收一边写入，接收完成写入完成
        req.pipe(writeStream)
        req.on('end', () => {
            // 接收数据完成
            res.end('OK');
        });
    }
});
server8000.listen(8000);
```

### Events

Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）。

所有能触发事件的对象都是 `EventEmitter` 类的实例。 这些对象有一个 `eventEmitter.on()` 函数，用于将一个或多个函数绑定到命名事件上。 

订阅发布模式定义了一种一对多的依赖关系,在Node中EventEmitter 对象上开放了一个可以用于监听的on(eventName,callback)函数,允许将一个或多个函数绑定到对应的事件上。

```js
const { EventEmitter } = require('events')
const emitter = new EventEmitter()
// emitter.getMaxListeners(): number
// 获取最大监听数
console.log(emitter.getMaxListeners()) // 10

// emitter.setMaxListeners(n: number): internal.EventEmitter
// 设置最大监听数
// 超过时提示 (node:2496) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 2 吃饭啦 listeners added. Use emitter.setMaxListeners() to increase limit
emitter.setMaxListeners(1) // emitter.getMaxListeners(): 1

// emitter.on/addListener(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 监听事件
emitter.on('eat', (a, b) => {
    console.log(`${a} 喊 ${b} 吃饭啦`)
    // 箭头函数不会指向实例
    console.log(this)
})
emitter.addListener('eat', function(a, b){
    console.log(`${a} 喊 ${b} 吃饭啦`)
    // this 指向 emitter
    console.log(this)
})

// emitter.once(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 只监听一次事件
emitter.once('eat', function(a, b){
    console.log(`我只叫一次`)
})

// 异步响应
emitter.on('eat', (a, b) => {
    console.log('异步')
    setImmediate(() => {
        console.log('异步-setImmediate')
    })
    setTimeout(() => {
        console.log('异步-setTimeout')
    })
    process.nextTick(() => {
        console.log('异步-nextTick')
    })
})

// emitter.prependListener/prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 在监听事件响应列表开头追加监听事件
emitter.prependListener('eat', function(...args){
    console.log('prepend')
    console.log(args)
})

// emitter.listenerCount(type: string | symbol): number
// 查看监听事件数
console.log(emitter.listenerCount('eat')) // 5

// emitter.listeners(event: string | symbol): Function[]
// 获取某个事件的监听回调
const listeners = emitter.listeners('eat')

// emitter.off/removeListener/removeAllListeners(event: string | symbol, listener: (...args: any[]) => void): internal.EventEmitter
// 删除某个事件的某个监听回调/所有
emitter.off('eat',listeners[0])
emitter.removeListener('eat',listeners[1])
emitter.removeAllListeners('eat')

// emitter.emit(event: string | symbol, ...args: any[]): boolean
// 触发事件
emitter.emit('eat', 'a', 'b') // a 喊 b 吃饭啦
emitter.emit('eat', 'a', 'b') // a 喊 b 吃饭啦

```

```js
// 实现一个基于 EventEmitter 的自定义类
function Plan(){
    EventEmitter.call(this)
}
// 继承 EventEmitter 类
Object.setPrototypeOf(Plan.prototype, EventEmitter.prototype)
Object.setPrototypeOf(Plan, EventEmitter)

const plan = new Plan()

const planRun = {
    '6:00' : function(){
        console.log('六点起床啦')
    },
    '7:00' : function(){
        console.log('七点出门啦')
    }
}

Object.keys(planRun).forEach(event => {
    plan.on(event, planRun[event])
})

const sleep = async (s) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, s*1000)
    })
}

const doSomeThings = async () => {
    plan.emit('6:00')
    await sleep(2)
    plan.emit('7:00')
}

doSomeThings() // 六点起床啦 两秒后 七点出门啦
```

### net

#### 网络模型

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200729225017516.png" alt="image-20200729225017516" style="zoom:50%;" />

#### 三次握手

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200729230814848.png" alt="image-20200729230814848" style="zoom:50%;" />

#### 使用net创建TCP链接

```js
const net = require('net')

// 服务端
const server = net.createServer(function(socket){
    // data 一端调用write()方法发送数据时，另一端会通过 监听 data 事件接收到
    socket.on('data', function(data){
        console.log(`from client data ${data.toString()}`)
        socket.write(`server`)
    })
    socket.write('welcome')
})

// 服务端主动关闭后触发
server.on('close', function(){
    console.log('connect close')
})

// 客户端连接到服务器是触发
server.on('connection', function(data){
    console.log(`connection`)
})

// 服务器发生异常时触发
server.on('error', function(data){
    console.log(`connection`)
})

// listening 事件 调用 server.listen()后触发
server.listen(8000, function(){
    console.log('server listening on port 8000')
})
server.on('listening', function(){
    console.log('server listening on port 8000')
})

// 客户端
const client = net.connect({ port: 8000 }, function(){
    console.log('client connected')
    console.log('from client')
})

// data 一端调用 write()方法发送数据时，另一端会通过监听 data 事件接收到
client.on('data', function(data){
    console.log(data.toString())
    // client.end()
})
// 客户端连接成功后触发
client.on('connect', function(){
    client.write('123')
    client.write('123')
    client.write('123')
    client.write('123')
})

// 调用write时触发
client.on('drain', function(){
    console.log('drain')
})

// 一定时间后连接不再活跃时触发
client.on('timeout', function(){
    console.log('timeout')
})

// 异常时触发
client.on('error', function(){
    console.log('client error')
})

// 任何一端结束时触发
client.on('end', function(){
    console.log('client closed')
})

```

#### 黏包问题

客户端（发送的一端）在发送之前会将短时间有多个发送的数据块缓冲到一起（发送端缓冲区），形成一个大的数据块一并发送，同样接收端也有一个接收端缓冲区，收到的数据先存放接收端缓冲区，然后程序从这里读取部分数据进行消费，这样做也是为了减少 I/O 消耗达到性能优化。

可以通过下面两种办法避免

1. 延迟发送（增加I/O次数）

2. 关闭Nagle算法（关闭`Nagle`算法并不总是有效的）

   `  client.setNoDelay(true)`

3. 封包/拆包

#### UDP服务

UDP：用户数据包协议，是一种网络传输层协议，无需进行连接，通过一个套接字就可以与多个UDP服务进行通信，资源消耗低，处理快速且灵活，但是在网络差的情况下容易丢包，一般用于偶尔丢包不造成重大影响的场景，比如音频，视频。

```js
/*
 * @Author: xiaohuolong
 * @Date: 2020-07-30 21:59:46
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-30 22:08:28
 * @FilePath: /node-demo/dgram/index.js
 */ 
const dgram = require('dgram')

// 创建UDP套接字
// dgram.createSocket(type: SocketType, callback?: (msg: Buffer, rinfo: RemoteInfo) => void): Socket
const server = dgram.createSocket('udp4')
// 接收到消息后触发
server.on('message', (msg) => {
    console.log(`server - ${msg.toString()}`)
})
// 监听后触发
server.on('listening', () => {
    console.log(`server - listening on 8000`)
})
// 关闭时触发
server.on('close', () => {
    console.log(`server - closing`)
})
// 异常发生时触发
server.on('close', () => {
    console.log(`server - error`)
})

server.bind(8000)

const client = dgram.createSocket('udp4')
client.on('message', (msg) => {
    console.log(`client - ${msg.toString()}`)
})
const clientMsg = Buffer.from('我来自客户端')
const serverMsg = Buffer.from('我来自服务端')

// client.bind(port?: number, address?: string, callback?: () => void): void
client.bind(8001)

client.send(clientMsg, 0, clientMsg.length, 8000, 'localhost')
// 发送数据
// server.send(msg: string | any[] | Uint8Array, port: number, address?: string, callback?: (error: Error, bytes: number) => void): void
server.send(serverMsg, 0, serverMsg.length, 8001, 'localhost')
// 关闭
server.close()
```

### http

#### HTTP

HTTP全称是超文本传输协议，是构建在TCP之上，属于应用层协议。

#### HTTP报文

```sh
➜  http git:(master) ✗ curl -v http://127.0.0.1:8000/123
# 三次握手过程
*   Trying 127.0.0.1...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 8000 (#0)
# 握手后，客户端向服务端发送请求报文
> GET /123 HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/7.54.0
> Accept: */*
> 
# 服务器处理完成，给客户端返回响应内容，包括响应头跟响应体
< HTTP/1.1 200 OK
< Date: Tue, 28 Jul 2020 14:06:45 GMT
< Connection: keep-alive
< Content-Length: 4
< 
* Connection #0 to host 127.0.0.1 left intact
/123% 
```

#### http模块

`http`模块包含对 `HTTP` 处理的封装，在 `Node` 中，`HTTP`服务继承自TCP服务器（net）模块。

它能和多个客户端保持链接，但由于采取事件驱动的方式，并不为每一个连接创建额外的线程或进程，保持很低的内存占用，所以能实现高并发。

#### **HTTP服务跟TCP服务模型的区别**

HTTP 是以 `request` 为单位进行服务的，TCP会话可以用于多次请求和响应，是以`connect`为单位进行服务的

<img src="/Users/chenxiayu/Library/Application Support/typora-user-images/image-20200728223652310.png" alt="image-20200728223652310" style="zoom:50%;" />

##### HTTP 请求

对于 TCP 连接的读操作，http 模块将其封装成 `ServerRequest`，通过 `http_parser` 进行解析

```sh
> GET /123 HTTP/1.1
> Host: 127.0.0.1:8000
> User-Agent: curl/7.54.0
> Accept: */*
> 
```

```js
// 第一行的数据
req.method = GET
req.url = '/123'
req.httpVersion = '1.1'
// 其余的报头解析放在 headers 上
req.headers = { 
  host: '127.0.0.1:8000',
  'user-agent': 'curl/7.54.0',
  accept: '*/*' 
}
// 如果报文体诗歌只读流的对象
var writeStream = fs.createWriteStream(fileName)
req.pipe(writeStream)
req.on('end', () => {
  // 需要等数据流接收数据完成才能操作
  res.end('OK');
});
```

##### HTTP 响应

http 模块对响应对象封装了对底层连接的写操作

`setHeader()` `writeHeader()` 对报文头进行操作

`end()` `write()` 对报文内容进行操作

```js
res.writeHead(200, { 'Content-Type': 'application/json'})
res.setHeader('Content-Type', 'application/json')
```

```sh
< HTTP/1.1 200 OK
< Content-Type: application/json
< Date: Tue, 28 Jul 2020 14:55:35 GMT
< Connection: keep-alive
< Content-Length: 15
< 
* Connection #0 to host 127.0.0.1 left intact
{"path":"/123"}% 
```

##### HTTP事件

```js
server.on('connect', (req) => {
    // 当客户端发起 COMMIT 请求时触发此事件
    console.log('connect')
})
server.on('connection', (req) => {
    // 连接建立时触发
    console.log('connection')
})
server.on('request', (req) => {
    // 请求发送到服务器时触发
    console.log('request')
})
server.on('close', (req) => {
    //调用 server.close() 时触发
    console.log('close')
})
server.on('checkContinue', (req) => {
    // 客户端发送较大数据时，先发送带有 Expect: 100-continue 的请求到服务端，触发此事件
    console.log('checkContinue')
})
server.on('upgrade', (req) => {
    // 当服务端接收到客户端要求升级连接协议请求时
    console.log('upgrade')
})
server.on('clientError', (req) => {
    // 连接客户端发生error事件时
    console.log('clientError')
})
```

##### HTTP 客户端

利用 `http.request` 方法可以发起一个HTTP请求。

调用客户端同时发起10个请求时，其实只有5个处于并发状态，其余的等某个请求发出后才会继续发出

```js
http.request({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/123321',
    method: 'GET',
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
        console.log(chunk)
    })
}).end()
```

##### HTTP 客户端事件

```js

req.on('response', (req) => {
    // 客户端在请求发出后得到服务端响应时触发
    console.log('req-response')
})
req.on('socket', (req) => {
    // 当底层连接池建立的连接分配给当前请求对象时触发
    console.log('req-socket')
})
req.on('connect', (req) => {
    // 客户端发起 COMMIT 请求后，如果服务端响应了 200时触发此事件
    console.log('req-connect')
})
req.on('upgrade', (req) => {
    // 客户端发起 upgrade 请求后，如果服务端响应了 101 switching Protocols 状态时触发
    console.log('req-upgrade')
})
req.on('continue', (req) => {
    // 客户端发送带有 Expect: 100-continue后，得到服务端响应了 100 Continue 状态时触发
    console.log('req-continue')
})
```

#### RPC

Remote Procedure Call（远程过程通信）

TCP 通信方式

* 单工通信：只能一端发出
* 半双工通信（轮番单工通信）：同一时间只能有一端发出
* 全双工通信：大家可以互相发

使用二进制协议

* 更小的数据包
* 更快的边解码速度

```js
// server.js
/*
 * @Author: xiaohuolong
 * @Date: 2020-07-30 23:36:57
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-31 10:02:41
 * @FilePath: /node-demo/rpc/server.js
 */ 
const net = require('net')
/**
 * 编码 | seq | buffer.length | data |
 */
const encode = (data, seq) => {
    const body = Buffer.from(data)
    const header = Buffer.alloc(6)
    header.writeInt16BE(seq)
    header.writeInt32BE(body.length, 2)

    const buffer = Buffer.concat([header, body])
    return buffer
}

/**
 * 解码 | seq | buffer.length | data |
 */
const decode = buffer => {
    const header = buffer.slice(0, 6)
    const seq = header.readInt16BE()
    const body = buffer.slice(6).readInt32BE()
    return {
        seq,
        data: body
    }
}

/**
 * 检查包是否接收完成 
 */
const checkComplete = buffer => {
    if (buffer.length < 6) {
        return 0
    }
    const bodyLength = buffer.readInt32BE(2)
    return 6 + bodyLength
}

const LESSON_DATA = {
    100000: "01",
    100001: "02",
    100002: "03",
    100003: "04",
    100004: "05",
    100005: "06",
}

const server = net.createServer((socket) => {
    let oldBuffer = null
    socket.on('data', function (buffer) {
        buffer = oldBuffer ? Buffer.concat([oldBuffer, buffer]) : buffer
        let packageLength = 0

        while (packageLength = checkComplete(buffer)) {
            const package = buffer.slice(0, packageLength)
            buffer = buffer.slice(packageLength)
            const result = decode(package)
            socket.write(
                encode(LESSON_DATA[result.data], result.seq)
            )
        }

        oldBuffer = buffer
    })
})

server.listen(8000)
```

```js
// client.js
/*
 * @Author: xiaohuolong
 * @Date: 2020-07-30 23:37:04
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-31 10:02:17
 * @FilePath: /node-demo/rpc/client.js
 */ 
const net = require('net')
const client = new net.Socket({})
const LESSON_IDS = [
    '100000',
    '100001',
    '100002',
    '100003',
    '100004',
    '100005',
]

client.connect({
    port: 8000,
    hostname: 'localhost'
})

let oldBuffer = null

client.on('data', (buffer) => {
    // 拼接上一个部分当buffer
    buffer = oldBuffer ? Buffer.concat([oldBuffer, buffer]) : buffer
    let completeLength = 0
    // 当包获取完毕
    while (completeLength = checkComplete(buffer)) {
        const package = buffer.slice(0, completeLength)
        buffer = buffer.slice(completeLength)
        // 解包
        const result = decode(package)
        console.log(`包${result.seq}，返回值是${result.data}`)
    }

    oldBuffer = buffer
})


let seq = 0
/**
 * 二进制包编码函数 | seq | buffer.length | data |
 */
const encode = data => {
    const id = LESSON_IDS[data.id]
    // body 6-10 放内容
    const body = Buffer.alloc(4)
    body.writeInt32BE(id)
    // header 0-6 放信息
    const header = Buffer.alloc(6)
    header.writeInt16BE(seq)
    header.writeInt32BE(body.length, 2)

    // 包头和包体拼起来发送
    const buffer = Buffer.concat([header, body])

    console.log(`seq = ${seq} id = ${id}`)
    seq++
    return buffer
}

/**
 * 二进制包解码函数 | seq | buffer.length | data |
 */
const decode = buffer => {
    // 0-6
    const header = buffer.slice(0, 6)
    // 读 seq
    const seq = header.readInt16BE()
    // 6-n
    const body = buffer.slice(6)

    return {
        seq,
        data: body.toString()
    }
}

/**
 * 检查包是否接收完毕
 */
const checkComplete = buffer => {
    // 检查一段buffer是不是一个完整的数据包小于6就接着获取
    if (buffer.length < 6) return 0
    // body 长度存放在 2-n
    const bodyLength = buffer.readInt32BE(2)
    return 6 + bodyLength
}

for (let index = 0; index < 10; index++) {
    const id = Math.floor(Math.random() * LESSON_IDS.length)
    client.write(encode({id}))
}
```

### process

`process` 是 `node`中处理进程的模块

#### 进程

进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。

我们启动一个服务、运行一个实例，就是开一个服务进程，例如`Java`里的`JVM`本身就是一个进程，`Node.js`里通过`node app.js`开启一个服务进程。

##### 多进程

多进程就是进程的复制（fork），fork出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了IPC通信，进程之间才可数据共享。

#### 线程

线程是操作系统能够进行运算调度的最小单位，首先我们要清楚线程是隶属于进程的，被包含于进程之中。一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。

同一进程中的多条线程将共享该进程中的全部系统资源，如虚拟地址空间，文件描述符和信号处理等。但同一进程中的多个线程有各自的调用栈（call stack），自己的寄存器环境（register context），自己的线程本地存储（thread-local storage)

##### 单线程

单线程就是一个进程只开一个线程

##### 多线程

单线程就是一个进程只开多个线程

#### node中的线程和进程

`node.js` 是服务端的运行环境，构建在V8引擎之上，基于事件驱动、非阻塞I/O模型，充分利用操作系统提供的异步I/O进行多任务执行，适合I/O密集型的应用场景。

在单核CPU系统中采用单进程+单线程的模式开发，在多核CPU系统可以通过复制多个子进程，开启多进程+单线程模式。开启多进程并不是解决高并发，而是解决CPU利用率不足的情况，充分发挥多核性能。

##### 多进程架构

主从模式，主进程不负责具体业务处理，只负责调度和管理工作进程，工作进程负责具体业务处理。

```js
// worker.js
const http = require('http')
const port = Math.round(8000 + Math.random() * 10)
http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World')
}).listen(port, (err) => {
    console.log(`http://localhost:${port}`)
})
```

```js
// master.js
const child_process = require('child_process')
const os = require('os')
const cpus = os.cpus()
cpus.map(cpu => {
   	// 复制多个进程
    child_process.fork('./worker.js')
})
```

##### 创建子进程的方式

```js
// 创建子进程的四种方式
// 启动一个子进程执行命令
// child_process.spawn(command: string, options?: SpawnOptionsWithoutStdio): ChildProcessWithoutNullStreams
child_process.spawn('node', ['worker.js'])

// 启动一个子进程执行命令，并且附带回调函数
// child_process.exec(command: string, callback?: (error: ExecException, stdout: string, stderr: string) => void): ChildProcess
child_process.exec('node worker.js', (err, stdout, stderr) => {
    console.log(stdout)
})

// 启动一个子进程执行可执行文件
// child_process.execFile(file: string): ChildProcess
child_process.execFile('worker', (err, stdout, stderr) => {
    console.log(stdout)
})

// 启动一个子进程执行命令，直接指定某个文件模块即可
// child_process.fork(modulePath: string, args?: readonly string[], options?: ForkOptions): ChildProcess
child_process.fork('./worker.js')
```

##### 进程通信

```js
// master.js
// 进程通信
const cp = child_process.fork('./worker.js')
cp.on('message', (msg) => {
    console.log(`parent get ${msg}`)
})
cp.send(321)
```

```js
// worker.js
process.on('message', (msg) => {
    console.log(`child ${msg}`)
})
process.send(123)
```

##### 进程句柄传递

可传递的句柄

* net.Socket：TCP套接字
* net.Server：TCP服务器
* net.Native：C++层面TCP套接字或IPC管道
* dgram.Socket：UDP套接字
* dgram.Native：C++层面UDP套接字

```js
// parent.js
const child_process = require('child_process')
const net = require('net')

const child1 = child_process.fork('child.js')
const child2 = child_process.fork('child.js')
const server = net.createServer()
server.on('connection', (socket) => {
    socket.end(`handler by parent ${process.pid}`)
})
server.listen(8000, () => {
    child1.send('server', server)
    child2.send('server', server)
    // 关掉
    server.close()
})
```

```js
// child.js
const http = require('http')
const server = http.createServer((req, res) => {
    res.end(`handler by child ${process.pid}`)
})
process.on('message', (msg, tcp) => {
    if(msg === 'server'){
        tcp.on('connection', socket => {
            server.emit('connection', socket)
        })
    }
})
```

##### 进程事件

```js
// 报错，无法触发创建，无法被杀死、无法发送消息时候触发
process.on('error', () => {
    
})
// 进程退出时触发
process.on('exit', () => {

})
// 进程输出终止时触发
process.on('close', () => {

})
// 进程调用disconnect()触发
process.on('disconnect', () => {
    
})
```

##### 自动重启

```js
// parent.js
const child_process = require('child_process')
const net = require('net')

const server = net.createServer()
const workers = {}
const createWorker = () => {
    const worker = child_process.fork(`${__dirname}/child.js`)
    worker.on('message', (msg) => {
        if(msg.act === 'suicide'){
            createWorker()
        }
    })
    worker.on('exit', () => {
        console.log(`worker ${worker.pid} exited`)
        delete workers[worker.pid]
        // createWorker()
    })
    worker.send('server', server)
    workers[worker.pid] = worker
    console.log(`create worker ${worker.pid}`)
}
server.on('connection', (socket) => {
    socket.end(`handler by parent ${process.pid}`)
})
server.listen(8002, () => {
    createWorker()
    createWorker()
    createWorker()
    createWorker()
    // 关掉
    // server.close()
})
process.on('exit', () => {
    for (const pid in workers) {
        workers[pid].kill()
    }
})
```

```js
// child.js
const http = require('http')
const server = http.createServer((req, res) => {
    setTimeout(() => {
        console.log('timeout')
        // 发生错误时 触发 uncaughtException
        throw new Error('123')
    }, 1000)
    res.end(`handler by child ${process.pid}`)
})
let worker
process.on('message', (msg, tcp) => {
    if(msg === 'server'){
        worker = tcp
        worker.on('connection', socket => {
            server.emit('connection', socket)
        })
    }
})
process.on('uncaughtException', () => {
    process.send({ act: 'suicide' })
    // 关闭连接
    worker.close(() => {
        // 关闭进程
        process.exit(1)
    })
    // 5秒后推出进程
    setTimeout(() => {
        process.exit(1)
    }, 5000)
})
```

#### 使用Cluster模块实现

```js
// index.js
const cluster = require('cluster')
const os = require('os');

if (cluster.isMaster){
    // 复制进程后触发
    cluster.on('fork', (worker) => {
        console.log(`create worker ${worker.process.pid}`)
    })
    // 复制一个工作进程后，工作进程主动发送online给主进程，接收后触发
    cluster.on('online', (worker) => {
        console.log(`online worker ${worker.process.pid}`)
    })
    // 工作进程调用listen()后，发送 listening 消息后触发
    cluster.on('listening', (worker) => {
        console.log(`listening worker ${worker.process.pid}`)
    })
    // 主进程和工作进程 断开连接后触发
    cluster.on('disconnect', (worker) => {
        console.log(`disconnect worker ${worker.process.pid}`)
    })
    for(let i = 0; i < os.cpus().length / 2; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`)
        cluster.fork();
    })
}else {
    require('./app.js')
}
```

```js
// app.js
const http = require('http')
const fs = require('fs')
const server = http.createServer((req, res) => {
    // const buffer = fs.readFileSync('./data.txt')
    setTimeout(() => {
        console.log('timeout')
        // 发生错误时 触发 uncaughtException
        throw new Error('123')
    }, 1000)
    res.end('buffer')
}).listen(8019, (err) => {
    console.log('Server listening')
})
```

### fs

```js
/*
 * @Author: xiaohuolong
 * @Date: 2020-08-05 10:16:12
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-08-05 13:03:09
 * @FilePath: /node-demo/fs/index.js
 */
const fs = require('fs')
const data = Buffer.from('我是内容\r')
// 写入文件
// fs.writeFile(path: string | number | Buffer | URL, data: any, options: WriteFileOptions, callback: NoParamCallback): void
// 同步方式
// fs.writeFileSync(path: string | number | Buffer | URL, data: any, options?: WriteFileOptions): void
fs.writeFile('data.txt', data, (err) => {
    console.log('write ok')
})

// 文件追加内容
// fs.appendFile(file: string | number | Buffer | URL, data: any, options: WriteFileOptions, callback: NoParamCallback): void
// 同步方式
// fs.appendFileSync(file: string | number | Buffer | URL, data: any, options?: WriteFileOptions): void
fs.appendFile('data.append.txt', data, (err) => {
    console.log('append ok')
})

// 读取文件
// fs.readFile(path: string | number | Buffer | URL, options: { encoding?: null; flag?: string; }, callback: (err: NodeJS.ErrnoException, data: Buffer) => void): void
// 同步方式读取
// fs.readFileSync(path: string | number | Buffer | URL, options?: { encoding?: null; flag?: string; }): Buffer
fs.readFile('data.txt', (err, data) => {
    console.log(data.toString())
})

setTimeout(() => {
    // 复制文件
    // fs.copyFile(src: PathLike, dest: PathLike, callback: NoParamCallback): void
    // 同步方式读取
    // fs.copyFileSync(src: PathLike, dest: PathLike, flags?: number): void
    fs.copyFile('data.txt', 'data.copy.txt', err => {
        console.log('copy ok')

        // 删除文件
        // fs.unlink(path: PathLike, callback: NoParamCallback): void
        // 同步方式
        // fs.unlinkSync(path: PathLike): void
        fs.unlink('data.copy.txt', err => {
            console.log('unlink data.copy.txt ok')
        })
    })
    
})

// 高级文件操作
// 打开文件
// flags 有平台差异，需查询官方文档
// fs.open(path: PathLike, flags: string | number, mode: string | number, callback: (err: NodeJS.ErrnoException, fd: number) => void): void
// 同步方式
// fs.openSync(path: PathLike, flags: string | number, mode?: string | number): number
fs.open('data.static.txt', 'r+', (err, fd) => {
    console.log(fd)
    /*
        fs.read(
            fd: number, 文件描述符，需要先使用 open 打开，使用fs.open打开成功后返回的文件描述符
            buffer: NodeJS.ArrayBufferView, 一个 Buffer 对象，v8引擎分配的一段内存，要将内容读取到的 Buffer
            offset: number, 整数，向 Buffer 缓存区写入的初始位置，以字节为单位
            length: number, 整数，读取文件的长度
            position: number, 整数，读取文件初始位置；文件大小以字节为单位
            callback: (err: NodeJS.ErrnoException, bytesRead: number, buffer: NodeJS.ArrayBufferView) => void
            回调函数，有三个参数 err（错误），bytesRead（实际读取的字节数），buffer（被写入的缓存区对象），读取执行完成后执行
        ): void
        同步读取
        fs.readSync(
            fd: number, 
            buffer: NodeJS.ArrayBufferView, 
            offset: number, 
            length: number, 
            position: number
        ): number
    */ 
    const buf = Buffer.alloc(6) 
    fs.readSync(fd, buf, 0, 6, 6)
    console.log(buf.toString())
    fs.read(fd, buf, 0, 6, 0, (err, bytes, buffer) => {
        console.log(bytes)
        console.log(buffer.toString())
        console.log(buf.toString())
    })
    /* 
        fs.write(
            fd: number, 文件描述符，使用fs.open 打开成功后返回的
            buffer: NodeJS.ArrayBufferView, 存储将要写入文件数据的 Buffer
            offset: number, 整数，从 Buffer 缓存区读取数据的初始位置，以字节为单位
            length: number, 整数，读取 Buffer 数据的字节数
            position: number, 整数，写入文件初始位置
            callback: (err: NodeJS.ErrnoException, written: number, buffer: NodeJS.ArrayBufferView) => void
            写入操作执行完成后回调函数，有三个参数 err（错误），bytesWritten（实际写入的字节数），buffer（被读取的缓存区对象），写入完成后执行。
        ): void
        同步写入
        fs.writeSync(fd: number, buffer: NodeJS.ArrayBufferView, offset?: number, length?: number, position?: number): number
    */
    fs.write(fd, Buffer.from('0123456789'), 1, 9, 0, (err, bytes, buffer) => {
        console.log(err)
        console.log(bytes)
        console.log(buffer.toString())
    })
    // 文件关闭
    // fs.close(fd: number, callback: NoParamCallback): void
    fs.close(fd, (err) => {
        console.log('close')
    })
})

// 创建文件夹
// fs.mkdir(path: PathLike, options: string | number | MakeDirectoryOptions, callback: NoParamCallback): void
// fs.mkdirSync(path: PathLike, options?: string | number | MakeDirectoryOptions): void
fs.mkdir('./data', (err) => {
    console.log('mkdir data ok')
    // 删除文件夹
    // fs.rmdir(path: PathLike, callback: NoParamCallback): void
    // fs.rmdirSync(path: PathLike, options?: RmDirOptions): void
    fs.rmdir('./data', (err) => {
        console.log('rmdir data ok')
    })
})

// 读取目录内容
// fs.readdir(path: PathLike, options: { encoding: BufferEncoding; withFileTypes?: false; } | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex", callback: (err: NodeJS.ErrnoException, files: string[]) => void): void
// fs.readdirSync(path: PathLike, options?: { encoding: BufferEncoding; withFileTypes?: false; } | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"): string[]
fs.readdir('./', (err, files) => {
    console.log(files)
})

// 创建一个可读流
// fs.createReadStream(path: PathLike, options?: string | { flags?: string; encoding?: string; fd?: number; mode?: number; autoClose?: boolean; emitClose?: boolean; start?: number; end?: number; highWaterMark?: number; }): ReadStream
const readStream = fs.createReadStream('data.static.txt')
// 创建一个可写流
// fs.createWriteStream(path: PathLike, options?: string | { flags?: string; encoding?: string; fd?: number; mode?: number; autoClose?: boolean; start?: number; highWaterMark?: number; }): WriteStream
const writeStream = fs.createWriteStream('data.static.copy.txt') //
// 通过pipe实现数据的流转
readStream.pipe(writeStream)
// 监听数据完成的情况
readStream.on('end',function () {
    console.log('拷贝完成');
})
```

##### 复制文件

```js
// 复制文件，用读取写入方式
const copyByRead = (src, dest) => {
    return new Promise((resolve, reject) => {
        fs.readFile(src, (err, buffer) => {
            if(err) return reject(err)
            fs.writeFile(dest, buffer, (err) => {
                if(err) return reject(err)
                resolve()
            })
        })
    })
}

const copyBySplice = (src, dest, size = 16 * 1024) => {
    return new Promise((resolve, reject) => {
        fs.open(src, 'r', (err, readFd) => {
            fs.open(dest, 'w', (err, writeFd) => {
                let buf = Buffer.alloc(size)
                let readPos = 0
                let writePos = 0
                const write = () => {
                    fs.read(readFd, buf, 0, size, readPos, (err, bytes) => {
                        readPos += bytes
                        fs.write(writeFd, buf, 0, bytes, writePos, (err, writeBytes) => {
                            if(!writeBytes){
                                fs.fsync(writeFd, err => {
                                    fs.close(writeFd, err => !err && resolve());
                                });
                            }else{
                                writePos += writeBytes
                                write()
                            }
                        })
                        if(!bytes) return fs.close(readFd, () => console.log('读取结束，关闭源文件'))
                    })
                }
                write()
            })
        })
    })
}

// 复制文件，用流读取写入
const copyByStream = (src, dest) => {
    return new Promise((resolve, reject) => {
        // 创建一个可读流
        // fs.createReadStream(path: PathLike, options?: string | { flags?: string; encoding?: string; fd?: number; mode?: number; autoClose?: boolean; emitClose?: boolean; start?: number; end?: number; highWaterMark?: number; }): ReadStream
        const readStream = fs.createReadStream(src)
        // 创建一个可写流
        // fs.createWriteStream(path: PathLike, options?: string | { flags?: string; encoding?: string; fd?: number; mode?: number; autoClose?: boolean; start?: number; highWaterMark?: number; }): WriteStream
        const writeStream = fs.createWriteStream(dest) //
        // 通过pipe实现数据的流转
        readStream.pipe(writeStream)
        // 监听数据完成的情况
        readStream.on('end', resolve)
    })
}
copyBySplice('data.large.txt', 'data.large.splice.copy.txt').then(() => {
    console.log('copy by splice')
})
copyByRead('data.large.txt', 'data.large.read.copy.txt').then(() => {
    console.log('copy by read')
})
copyByStream('data.large.txt', 'data.large.stream.copy.txt').then(() => {
    console.log('copy by stream')
})
```





































