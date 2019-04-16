// webpack.config.js
const path = require('path')
//首先引入插件,插件是一个类,使用的时候需要先 new 
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//需要装 cross-env 来做跨平台的兼容 
// 将package.json 中的 scripts  "build": "cross-env NODE_ENV=production webpack" 
// 这样代码就能知道我们是处于什么环境打包的
const devMode = process.env.NODE_ENV !== 'production' //判断是否生产环境
const styleLoader = 'style-loader'
const miniLoader =  {
  loader:MiniCssExtractPlugin.loader,
  options:{
    publicPath: '../'
  }
}
// 这个插件暂时不支持 HMR ，开发环境中还是使用 style-loader
const extractLoader = devMode ? styleLoader : miniLoader
const cssLoader = 'css-loader'
const postcssLoader = 'postcss-loader'
const lessLoader = 'less-loader'
const sassLoader = 'sass-loader'
const cssLoaders = [
  extractLoader,
  cssLoader,
  postcssLoader,
]
const lessLoaders = [
  ...cssLoaders,
  lessLoader,
]
const sassLoaders = [
  ...cssLoaders,
  sassLoader,
]
module.exports = {
  entry:{
    index:'./src/index.js'
  }, //单页面入口
  output:{
    path: path.resolve('dist'), // 打包后目录，需为绝对路径
    filename: '[name].[hash:8].js', // 打包后文件名
    chunkFilename: '[name].[hash:8].js'
  },          //出口
  module:{
    rules:[
      {
        test: /\.css$/, //匹配查找 css 文件
        include: path.resolve(__dirname, 'src'),
        use: cssLoaders
      },
      {
        test: /\.less$/, //匹配查找 less 文件
        include: path.resolve(__dirname, 'src'),
        use: lessLoaders 
      },
      {
        test: /\.scss$/, //匹配查找 scss 文件
        include: path.resolve(__dirname, 'src'),
        use:sassLoaders
      },
      {
        test:/\.js$/,
        use: 'babel-loader',
        include: /src/,          // 只转化src目录下的js
        exclude: /node_modules/  // 排除掉node_modules，优化打包速度
      },
      {
        test:/\.(jpe?g|png|gif)$/,
        exclude: /src\//,  // 排除掉node_modules，优化打包速度
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 1000,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: 'images/'   // 图片打包后存放的目录
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/,
        include: path.resolve(__dirname, 'src'),
        use: 'html-withimg-loader' // html里面所有的img链接
      },
     
      {
        test: /\.(eot|ttf|woff|svg)$/,
        include: path.resolve(__dirname, 'src'),
        use: 'file-loader'
      }
    ]
  },          //处理对应模块
  resolve: {
    // 别名
    alias:{
      main: path.join(__dirname, 'src/main.js')
    },
    //省略后缀名
    extensions:['.js','.json','.less','.scss','.css']
  }
}