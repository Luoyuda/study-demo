/*
 * @Author: xiaohuolong
 * @Date: 2020-06-04 17:12:25
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-06-04 17:24:38
 * @FilePath: /study-demo/demo/backend/app.js
 */ 
const http = require('http')
const url = require('url')
const fs = require('fs')
http.createServer(function(req,res){
    let pathname = url.parse(req.url).pathname
    res.writeHead(200,{ContentType:'text/html'})
    res.end(`<p>test node${pathname}</p>`)
}).listen(5858)