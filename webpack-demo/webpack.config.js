// webpack.config.js
const path = require('path')
//首先引入插件,插件是一个类,使用的时候需要先 new 
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
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
const baseConfig = {
  entry:{
    index:'./src/index.js'
  }, //单页面入口
  // entry:{
  //   pageA:'./src/pageA.js',
  //   pageB:'./src/pageB.js'
  // }, //单页面入口
  output:{
    // publicPath: __dirname + "/dist/",
    path: path.resolve('dist'), // 打包后目录，需为绝对路径
    filename: '[name].[hash:8].js', // 打包后文件名
    chunkFilename: '[name].[hash:8].js'
  },          //出口
  // optimization:{
  //   splitChunks:{
  //     cacheGroups:{
  //       vendor:{
  //         // 抽离第三方插件 打包node_modules下的第三方包
  //         test: /node_modules/,
  //         chunks:'initial',
  //         // 打包后的文件名，任意命名
  //         name:'vendor',
  //         // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
  //         priority:10
  //       },
  //       utils:{
  //         // 抽离自己写的公共代码
  //         chunks:'initial',
  //         name:'utils',
  //         minSize:0
  //       }
  //     }
  //   }
  // },
  module:{
    rules:[
      {
        test: /\.css$/, //匹配查找 css 文件
        // style-loader/miniCss-loader ← css-loader ← postcss-loader
        use: cssLoaders
      },
      {
        test: /\.less$/, //匹配查找 less 文件
        // style-loader/miniCss-loader ← css-loader ← postcss-loader ← less-loader
        use: lessLoaders 
      },
      {
        test: /\.scss$/, //匹配查找 scss 文件
        // style-loader/miniCss-loader ← css-loader ← postcss-loader ← sass-loader
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
        use: 'html-withimg-loader' // html里面所有的img链接
      },
     
      {
        test: /\.(eot|ttf|woff|svg)$/,
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

const proConfig = {
  mode:'production',  //模式配置
  plugins:[
    new CleanWebpackPlugin(), //清理文件夹
    new CleanWebpackPlugin(), //清理文件夹
    new HtmlWebpackPlugin({
      template:'./src/index.html', // 打包目标模板
      // title:'我被打包了',// 不用 template 时候生效
      filename:'bundle.html', // 换个文件名
    }),
    // new HtmlWebpackPlugin({
    //   template:'./src/index.html', // 打包目标模板
    //   filename:'pageA.html',
    //   chunks:['vendor','utils','pageA']
    // }),
    // new HtmlWebpackPlugin({
    //   template:'./src/index.html', // 打包目标模板
    //   filename:'pageB.html',
    //   chunks:['vendor','utils','pageB']
    // }),
    // 将所有的CSS提取到一个文件中
    new MiniCssExtractPlugin({
      filename:'css/[name].css'
    }),
    // new ExtractTextWebpackPlugin({
    //   filename:'css/[name].css'
    // })
  ],         //对应插件
}

const devConfig = {
  mode:'development',  //模式配置
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: 'localhost',      // 默认是localhost
    port: 3000,             // 端口
    open: true,             // 自动打开浏览器
    hot: true               // 开启热更新
  }
}

  
const config = devMode ? devConfig : proConfig

module.exports = {
  ...baseConfig,
  ...config
}
