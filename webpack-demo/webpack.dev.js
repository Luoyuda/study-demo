// webpack.dev.js
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common,{
  mode:'development',  //模式配置
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: 'localhost',      // 默认是localhost
    port: 3000,             // 端口
    open: true,             // 自动打开浏览器
    hot: true               // 开启热更新
  }
})
