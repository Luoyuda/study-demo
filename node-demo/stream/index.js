/*
 * @Author: xiaohuolong
 * @Date: 2020-07-27 16:28:14
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-07-27 16:34:45
 * @FilePath: /study-demo/node-demo/stream/index.js
 */ 
const http = require('http');
const fs = require('fs');
const path = require('path');

// const server8000 = http.createServer(function (req, res) {
//     const fileName = path.resolve(__dirname, 'data.txt');
//     // // 流的方式读取文件，不需要把文件全部读取了再返回，而是一边读取一边返回，数据通过管道流动给客户端
//     let stream = fs.createReadStream(fileName);  // 这一行有改动
//     stream.pipe(res); // 这一行有改动
// });
// server8000.listen(8000);

// const server8001 = http.createServer(function (req, res) {
//     const fileName = path.resolve(__dirname, 'data.txt');
//     // 普通读取文件，遇到大文件，如果高并发的情况下，会使用大量内存
//     fs.readFile(fileName, function (err, data) {
//         res.end(data);
//     });
// });
// server8001.listen(8001);

const server8000 = http.createServer((req, res) => {
    const method = req.method; // 获取请求方法
    if (method === 'GET') {
        const fileName = path.resolve(__dirname, 'data.txt');
        // // 流的方式读取文件，不需要把文件全部读取了再返回，而是一边读取一边返回，数据通过管道流动给客户端
        let stream = fs.createReadStream(fileName);  // 这一行有改动
        stream.pipe(res); // 这一行有改动
    } else if (method === 'POST'){
        var fileName = path.resolve(__dirname, 'data.txt');
        var writeStream = fs.createWriteStream(fileName)
        req.pipe(writeStream)
        req.on('end', () => {
            // 接收数据完成
            res.end('OK');
        });
    }
});
server8000.listen(8000);