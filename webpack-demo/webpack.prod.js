// webpack.prod.js
//首先引入插件,插件是一个类,使用的时候需要先 new 
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common, {
  mode:'production',  //模式配置
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins:[
    new CleanWebpackPlugin(), //清理文件夹
    new HtmlWebpackPlugin({
      template:'./src/index.html', // 打包目标模板
      // title:'我被打包了',// 不用 template 时候生效
      filename:'index.html', // 换个文件名
    }),
    new MiniCssExtractPlugin({
      filename:'css/[name].css'
    }),
  ],         //对应插件
})