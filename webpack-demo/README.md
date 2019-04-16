鉴于自己 `webpack` 知识一过久了就忘记的尿性，今天闲来无事又敲一遍，顺便做个记录

### [github 链接先放！](https://github.com/Luoyuda/webpack-demo)

![](https://user-gold-cdn.xitu.io/2019/3/14/1697c8a8d8f3f900?w=400&h=368&f=png&s=223517)
众所周知，`webpack` 以配置麻烦闻名于世，像我这种记忆力越来越差的人想起他就觉得头皮发麻

## 先连接好水管
1. 创建文件夹 `npm init -y`
    * 这个没啥好说...
2. `npm i -D webpack webpack-cli webpack-dev-server`
    * `webpack4` 之后需要单独安装多一个 `webpack-cli` 
    * `webpack-dev-server` 这个大佬是起一个本地服务器的，你懂我意思吧
3. 创建一个 `webpack.config.js` 文件，用来写配置(对的，用来写你写完，一个月不写就会全部忘光光的配置！所以你到底零配置了什么...)
![](https://user-gold-cdn.xitu.io/2019/3/14/1697c89cb0a75efe?w=720&h=719&f=png&s=468061)
![](https://user-gold-cdn.xitu.io/2019/3/14/1697c89252470b21?w=193&h=118&f=png&s=7075)
4. 好了，我们的文件开写，先把几个神仙请出来
    ```js
    module.exports = {
      entry:'',           //入口
      output:{},          //出口
      module:{},          //处理对应模块
      plugins:[],         //对应插件
      devServer:{},       //开发服务器设置
      mode:'development'  //模式配置
    }
    ```
    *  `entry` 就是入口，它霸道的掌握了整个 `webpack` 的门口，什么神仙都是从这里进去的，你可以使用字符串语法或者对象语法来定义入口
    ```js
        module.exports = {
        //一般这么写
          entry:'./src/index.js', //单页面入口
          entry:{                 //多页面应用入口
            index:'./src/index.js',
            main:'./src/main.js'
          },
          ...
        }
    ```
    * `output` 则是 `webpack` 出口，对应入口来说，整个 `webpack` 过程你可以理解成人体消化系统，而入口进去的食物，总将会变成 X 输出，从 `entry` 通向 `output`
    * `module` 是指 `webpack` 所处理的模块，比如 ES6、LESS\SASS\CSS、图片等在项目中的种种东西，需要对应的 `loader` 来对正则匹配的文件进行处理，如 转换 ES6 要用到 `babel-loader` 来处理 `/\.js$/` 的文件
        * `loader` 则是用于对模块的源代码进行转换的小工具。
    * `plugin` 插件存在的目的在于解决 `loader` 无法实现的其他事，比如可以用一些插件来对代码进行压缩
    * `devServer` 这个则是配置一个静态的服务器，它默认自动刷新。
    * `mode` 告知 `webpack` 使用相应环境的内置优化，一般是 `development` 或 `production`
    
![](https://user-gold-cdn.xitu.io/2019/3/15/1697fc8b1937a43b?w=198&h=198&f=png&s=33248)
5. 配一下执行文件先...
* 找到你的 `package.json` 然后写进去，写完你就可以快乐的在 `cmd` 里面快乐的 `npm run xxx`
![](https://user-gold-cdn.xitu.io/2019/3/15/1697fcaf9c5f25d4?w=459&h=462&f=png&s=40297)
6. 然后我们创建一个 `src` 文件夹，创建个 `index.js`。就随便写句话吧
    ```js
    //index.js
    console.log('webpack 配置简单')
    ```
7. 然后我们回到 `webpack.config.js` 将入口，出口配置好，然后 `npm run build` 一下，你就能看到文件夹中出现 `dist` 文件夹，里面有个 `index.js` 辣。就这样我们完成了第一次 `webpack` 之旅
    ```js
    //webpack.config.js
    const path = require('path')
    module.exports = {
      // entry:'',           //入口
      entry:'./src/index.js', //单页面入口
      // entry:{                 //多页面应用入口
      //   index:'./src/index.js',
      //   main:'./src/main.js'
      // },
      output:{
        filename: 'index.js', // 打包后文件名
        path: path.resolve('dist') // 打包后目录，需为绝对路径
      },          //出口
      // module:{},          //处理对应模块
      // plugins:[],         //对应插件
      // devServer:{},       //开发服务器设置
      // mode:'development'  //模式配置
    }
    ```
    
![](https://user-gold-cdn.xitu.io/2019/3/16/169841e6466aa5cc?w=198&h=194&f=png&s=63037)
到这里大家应该对`webpack`有了个小的了解，其实他就是条 ‘管道’ 我们将各种文件都交给他，最后他输出我们配置好的输出文件。

其实比较类似人体的消化系统...你给他吃各种食物，最后输出...你懂我意思吧

![](https://user-gold-cdn.xitu.io/2019/3/16/1698421d000a8cf7?w=198&h=171&f=png&s=32981)
## 给管道添加各类处理程序
`webpack` 的魅力在于它能处理开发项目中的一切你需要它处理的模块，只要你给他装了相应的模块配置，它就能给你干一切脏活累活。
### html 
在打包 html 的时候，一般我们在实际开发中都会用一个 html 文件来做一切页面的入口，我们要来实现 html 的打包功能， 需要一个模板来实现，各种引用好路径的 html 。

这里就需要一个很常用的插件 html-webpack-plugin 来帮我们把 html 搞出来
1. 装插件，先 npm 装一下
    ```
    npm i html-webpack-plugin -D
    ```
2. 创建一个index.html 作为模板使用(当然你也可以不用模板)
    ![](https://user-gold-cdn.xitu.io/2019/3/16/169844817ea1c91f?w=1013&h=359&f=png&s=41569)
3. 接下来要往 `webpack.config.js` 管子里装设备了
    ```js
    const path = require('path')
    //首先引入插件,插件是一个类,使用的时候需要先 new 
    const HtmlWebpackPlugin = require('html-webpack-plugin') 
    
    module.exports = {
      entry:'./src/index.js', //单页面入口
      output:{
        filename: 'index.js', // 打包后文件名
        path: path.resolve('dist') // 打包后目录，需为绝对路径
      },          //出口
      // module:{},          //处理对应模块
      plugins:[
        new HtmlWebpackPlugin({
          template:'./src/index.html', // 打包目标模板
          // title:'我被打包了',// 不用 template 时候生效
          // filename:'bundle.html', // 换个文件名
        })
      ],         //对应插件
      // devServer:{},       //开发服务器设置
      // mode:'development'  //模式配置
    }
    ```
4. 写完，打包，一气呵成。不出意外你会得到一个这样的文件
    ![](https://user-gold-cdn.xitu.io/2019/3/16/169845a2ec8f64e5?w=1093&h=383&f=png&s=66381)

#### 多页面开发配置
```js
// webpack.config.js
const path = require('path')
//首先引入插件,插件是一个类,使用的时候需要先 new 
const HtmlWebpackPlugin = require('html-webpack-plugin') 

module.exports = {
  entry:{
    index:'./src/index.js',
    main:'./src/main.js',
  }, //多页面入口
  output:{
    filename: '[name].js', // 打包后文件名
    path: path.resolve('dist') // 打包后目录，需为绝对路径
  },          //出口
  // module:{},          //处理对应模块
  plugins:[
    new HtmlWebpackPlugin({
      template:'./src/index.html', // 打包目标模板
      filename:'index.html',
      chunks:['index'], //块 表示 你注入的 js 
    }),
    new HtmlWebpackPlugin({
      template:'./src/main.html', // 打包目标模板
      filename:'main.html',
      chunks:['main'], //块 表示 你注入的 js 
    })
  ],         //对应插件
  // devServer:{},       //开发服务器设置
  // mode:'development'  //模式配置
}
```
![](https://user-gold-cdn.xitu.io/2019/3/16/169846f8d9afe77d?w=1740&h=886&f=png&s=250901)
![](https://user-gold-cdn.xitu.io/2019/3/16/1698479f9f3014ca?w=347&h=347&f=gif&s=883506)
### css 
处理完 `html` 我们接着来处理 `css`，处理 `css` 文件，则需要在配置文件中配置 `module` ，当然需要指定的 `loader` 来搭配一起辅助。

一般处理 `css` 模块的 `loader` 是这两个大佬
* `css-loader` ： 很单纯的处理 `css` 的 `loader`
* `style-loader` ：将处理好的 `css-loader` 的样式代码 插入文件中

东西说完，我们开搞
1. 装东西
    ```
    npm i css-loader style-loader -D
    ```
2. 创建对应文件，写东西，代码引入
    ```js
    //index.js
    import './css/style-css.css';
    console.log('webpack 配置简单')
    ```
    ```css
    /* style-css.css */
    body{
      background-color: #000;
    }
    ```
3. 写配置
    ```js
    // webpack.config.js
    ...
    //首先引入插件,插件是一个类,使用的时候需要先 new 
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    
    module.exports = {
      ...
      module:{
        rules:[
          {
            test: /\.css$/, //匹配查找 css 文件
            use:['style-loader', 'css-loader'] //从右往左解析 style-loader ← css-loader
          }
        ]
      },          //处理对应模块
      ...
    }

    ```
4. 打包查看效果
![](https://user-gold-cdn.xitu.io/2019/3/16/16984cc48f8e2a58?w=1186&h=918&f=png&s=107165)
这样子`css`就被打包进去`js`文件了，品如跟洪世贤在一起了，这显然不是我们想要的鸭。这时候就需要人来帮我们来挖墙脚。
![](https://user-gold-cdn.xitu.io/2019/3/16/1698477fd0094566?w=240&h=211&f=png&s=29723)

#### 分手大师
我们现在要用一个插件来实现我们棒打鸳鸯的目的，这个插件可以是 `mini-css-extract-plugin` 或者 `extract-text-webpack-plugin`。
![](https://user-gold-cdn.xitu.io/2019/3/16/16984d406f960d1d?w=221&h=218&f=png&s=43748)
##### 先说 `mini-css-extract-plugin` 
`mini-css-extract-plugin`这个插件据说是为了 `webpack4` 而生的，那我们就来跟跟潮流~
1. 先装
    ```js
    npm i -D mini-css-extract-plugin
    ```
2. 再写，这里的原理跟 `html-webpack-plugin` 是差不多的。将 `style-loader` 替换成 `MiniCssExtractPlugin.loader` ，然后在用插件生成文件。
    ```js
    // webpack.config.js
    ...
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    
    module.exports = {
      ...
      module:{
        rules:[
          {
            test: /\.css$/, //匹配查找 css 文件
            // use:['style-loader', 'css-loader'] //从右往左解析 style-loader ← css-loader
            use:[MiniCssExtractPlugin.loader, 'css-loader'] //从右往左解析 style-loader ← css-loader
          }
        ]
      },          //处理对应模块
      plugins:[
       ...
        new MiniCssExtractPlugin({
          filename:'css/[name].css'
        })
      ],         //对应插件
      ...
    }
    ```
3. 然后得到
    ![](https://user-gold-cdn.xitu.io/2019/3/16/16985027129cb41b?w=1353&h=930&f=png&s=209162)

#### `extract-text-webpack-plugin`
 `extract-text-webpack-plugin` 则是一直以来 `webpack` 分拆 `js` 喝 `css` 的一个插件
1. 装
    ```js
    //@next 版本支持 webpack4
    npm i -D extract-text-webpack-plugin@next
    ```
2. 写
    ```js
    // webpack.config.js
    ...
    const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
    const CleanWebpackPlugin = require('clean-webpack-plugin')
    //需要装 cross-env 来做跨平台的兼容 
    // 将package.json 中的 scripts  "build": "cross-env NODE_ENV=production webpack" 
    // 这样代码就能知道我们是处于什么环境打包的
    const devMode = process.env.NODE_ENV !== 'production' //判断是否生产环境
    const cssLoaders = [
      'css-loader'
    ]
    
    module.exports = {
      ...
      module:{
        rules:[
          {
            test: /\.css$/, //匹配查找 css 文件
            // use:['style-loader', 'css-loader'] //从右往左解析 style-loader ← css-loader
            // use:[
            //   // 这个插件暂时不支持 HMR ，开发环境中还是使用 style-loader
            //   devMode ? 'style-loader' : {
            //     loader:MiniCssExtractPlugin.loader,
            //     options:{
            //       // 这里可以指定一个 publicPath
            //       // 默认使用 webpackOptions.output中的publicPath
            //       // publicPath:''
            //     }
            //   }, 
            //   'css-loader'
            // ] //从右往左解析 MiniCssExtractPlugin.loader ← css-loader
            use: devMode ? ['style-loader',...cssLoaders] : ExtractTextWebpackPlugin.extract({
              fallback: "style-loader",
              use:cssLoaders
            })
          }
        ]
      },          //处理对应模块
      plugins:[
        ...
        // 将所有的CSS提取到一个文件中
        // new MiniCssExtractPlugin({
        //   filename:'css/[name].css'
        // }),
        new ExtractTextWebpackPlugin({
          filename:'css/[name].css'
        })
      ],         //对应插件
      ...
    }
    ```
3. 得到
    ![](https://user-gold-cdn.xitu.io/2019/3/16/169855dd44955295?w=1733&h=994&f=png&s=381820)

其实两者用着感觉差别并不大，如果有需要分开打包 css 文件的话则后者更好用点，毕竟前者还未支持;前者用着更加简单舒服点
#### LESS 、SASS 、 postCss 这群小婊砸们怎么融入进来呢？
##### LESS
处理 `LESS` 文件，那必须是要使用 `less` 跟 `less-loader` 模块啦。什么，你难道觉得不需要咩
1. 装
    ```js
    npm i -D less less-loader
    ```
2. 写，这里其实已经万变不离其宗了，需要注意的是 `loader` 解析方向
    ```js
    // webpack.config.js
    ...
    const cssLoaders = [
      'css-loader',
      'less-loader'
    ]
    
    module.exports = {
      ...
      module:{
        rules:[
          ...
          {
            test: /\.less$/, //匹配查找 css 文件
            // use:['style-loader', 'css-loader', 'less-loader'] //从右往左解析 style-loader ← css-loader
            use:[
              devMode ? 'style-loader' : {
                loader:MiniCssExtractPlugin.loader,
                options:{
                }
              }, 
              ...cssLoaders
            ] //从右往左解析 MiniCssExtractPlugin.loader ← css-loader ← less-loader
          }
        ]
      },          //处理对应模块
      ...
    }

    ```
3. 得到
    ![](https://user-gold-cdn.xitu.io/2019/3/16/1698575cd5664345?w=1731&h=1001&f=png&s=377179)

##### SASS
`SASS` 文件的处理其实跟 `LESS` 差不太多，需要装 `sass-loader`  和 `node-sass` 来帮忙解析
1. 装  
    ```js
    npm i -D sass-loader node-sass
    ```
2. 写，其实跟 LESS 一个套路辣
    ```js
    // webpack.config.js
    ...
    const sassLoaders = [
      'css-loader',
      'sass-loader'
    ]
    
    module.exports = {
      ...
      module:{
        rules:[
          ...
          {
            test: /\.scss$/, //匹配查找 scss 文件
            // use:['style-loader', 'css-loader', 'sass-loader'] //从右往左解析 style-loader ← css-loader ← sass-loader
            use:[
              devMode ? 'style-loader' : {
                loader:MiniCssExtractPlugin.loader,
                options:{
                }
              }, 
              ...sassLoaders
            ] //从右往左解析 MiniCssExtractPlugin.loader ← css-loader ← sass-loader
          }
        ]
      },          //处理对应模块
      ...
    }

    ```
3. 得到
    ![](https://user-gold-cdn.xitu.io/2019/3/16/16985997028c4aa0?w=1372&h=956&f=png&s=230813)

##### PostCSS
`PostCSS` 是 一款使用插件转换 `CSS` 的工具，里面有很多实用的插件，比如 `Autoprefixer`
1. 装
    ```js
    npm i -D postcss-loader autoprefixer
    ```
2. 写，先添加一个`postcss.config.js`，用来写 `postcss-loader` 的配置，也可以在 `webpack.config.js` 里面用对象方式写，不过一般是单独一个文件写，之后的配置需要注意的问题是 `postcss-loader` ，需要插在 `css-loader` 之前。
    ```js
    //postcss.config.js
    module.exports = {
      plugins: [
          require('autoprefixer')({
              browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie> 8'] 
          })
      ] 
    }
    ```
    ```js
    // webpack.config.js
    const sassLoaders = [
      'css-loader',
      'postcss-loader',//需要插在css-loader之前
      'sass-loader'
    ]
    module.exports = {
      ...
      module:{
        rules:[
          ...
          {
            test: /\.scss$/, //匹配查找 scss 文件 
            use:[
              devMode ? 'style-loader' : {
                loader:MiniCssExtractPlugin.loader,
                options:{
                }
              }, 
              ...sassLoaders
            ] 
            //从右往左解析 MiniCssExtractPlugin.loader ← css-loader ← postcss-loader ← sass-loader
          }
        ]
      }, 
      ...
    }
    ```
3. 得到
    ![](https://user-gold-cdn.xitu.io/2019/3/16/1698602eb5cddbd6?w=1748&h=947&f=png&s=286932)

到这里 `CSS` 模块的处理的差不多了，整理一下代码
```js
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
  options:{}
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
  entry:'./src/index.js', //单页面入口
  output:{
    filename: '[name].js', // 打包后文件名
    path: path.resolve('dist') // 打包后目录，需为绝对路径
  },          //出口
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
      }
    ]
  },          //处理对应模块
  plugins:[
    new CleanWebpackPlugin(), //清理文件夹
    new HtmlWebpackPlugin({
      template:'./src/index.html', // 打包目标模板
      // title:'我被打包了',// 不用 template 时候生效
      // filename:'bundle.html', // 换个文件名
    }),
    // 将所有的CSS提取到一个文件中
    new MiniCssExtractPlugin({
      filename:'css/[name].css'
    }),
    // new ExtractTextWebpackPlugin({
    //   filename:'css/[name].css'
    // })
  ],         //对应插件
  // devServer:{},       //开发服务器设置
  // mode:'development'  //模式配置
}
```
![](https://user-gold-cdn.xitu.io/2019/3/16/169860afab1bbea7?w=198&h=136&f=png&s=23951)
### js
现在来处理 `js` 辣，都 2019 年了，现在谁还不认识个 `ES6` 

是的，低版本浏览器就不认识，所以这就需要一个很牛逼的东西来转义我们的`ES6` 成 `ES5`

那就是babel(爸爸)！
1. 装
    ```js
    npm i babel-core babel-loader babel-preset-env babel-preset-stage-0 -D
    ```
2. 写，这里我们需要写一个配置文件 `.babelrc` ，然后写下处理的对象
    ```js
    // .babelrc
    {
      "presets": ["@babel/preset-env"]   // 从右向左解析
    }
    ```
    ```js
    // webpack.config.js
    ...
    module.exports = {
      ...
      module:{
        rules:[
          ...
           {
            test:/\.js$/,
            use: 'babel-loader',
            include: /src/,          // 只转化src目录下的js
            exclude: /node_modules/  // 排除掉node_modules，优化打包速度
          }
        ]
      },  
     ...
    }
    ```
3. 这样配置完，我们就可以在项目里面写 `ES6` 代码了，`webpack` 会帮我们转义成 `ES5`

![](https://user-gold-cdn.xitu.io/2019/3/16/169864da16bf05f4?w=198&h=148&f=png&s=40425)

### 图片文件
上面那些大佬已经被我们安排的明明白白的，目前还有个图片文件处理需要我们来肝。

处理图片需要用到 `file-loader`、`url-loader` 和 `html-withimg-loader`

1. 装
    ```js
    npm i file-loader url-loader html-withimg-loader -D
    ```
2. 写，这里需要注意的是路径问题，需要在打包成文件的时候指定一下路径
     ```js
    // webpack.config.js
    const miniLoader =  {
      loader:MiniCssExtractPlugin.loader,
      options:{
        publicPath: '../'
      }
    }
    ...
    module.exports = {
      ...
      module:{
        rules:[
          ...
           {
            test:/\.(jpe?g|png|gif)$/,
            use:[
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
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
      },  
     ...
    }
    ```
3. 效果
    ![](https://user-gold-cdn.xitu.io/2019/3/16/16986d714b199e83?w=1721&h=1021&f=png&s=285903)
 

### 雪碧图
处理雪碧图用的 `postcss-sprites` 是基于 `postcss-loader` 的插件
1. 装
    ```js
    npm i -D postcss-sprites
    ```
2. 写，这里需要一个 `postcss-sprites-config.js` 文件来写 `postcss-sprites` 的配置，也可以写在 `postcss-config.js` 里面。然后在 `postcss-config.js` 补上我们的配置，这样就能去合成雪碧图了
    ```js
    /** postcss-sprites-config.js
     * 这里的项目结构是
     * —src
     * ——icons
     * ———icons-@1x
     * ———— *.png
     * ———icons-@2x
     * ———— *.png
     *  */ 
    var postcss = require('postcss');
    // 合法的散列图path 查找 /src/icons/*/*.png
    const REG_SPRITES_PATH = /\/icons\/(.*?)\/.*/i
    // 合法的retina标识 @*x
    const REG_SPRITES_RETINA = /@(\d+)x\./i
    // split
    const SPLIT = true
    const SPLIT_REG = /\?/ig
    const RETINA = true
    const OUTPUT_PATH = "./dist/sptite"
    
    module.exports = {
      spritePath: OUTPUT_PATH,
      //过滤 除了 icons 以外 的图片链接
      //需返回一个Promise对象
      filterBy: (image)=> {
        return REG_SPRITES_PATH.test(image.url) ? Promise.resolve() : Promise.reject()
      },
      //分组 分出 1 / 2 / 3 / n倍 图
      groupBy: (image) => {
        let groups = null;
        let groupName = '';
        let module = image.originalUrl.split(/\?/) 
        image.url = module[0]
        if(module.length > 1){
          //分模块 ? 跟模块名
          groupName = module[1] + '-'
        }
        if (SPLIT) {
          groups = REG_SPRITES_PATH.exec(image.url);
          groupName += groups ? groups[1] : 'icons';
        } else {
          groupName += 'icons';
        }
        //处理多倍图的情况
        if (RETINA) {
          image.retina = RETINA;
          image.ratio = 1;
          let ratio = REG_SPRITES_RETINA.exec(image.url);
          if (ratio) {
            ratio = ratio[1];
            while (ratio > 10) {
              ratio = ratio / 10;
            }
            image.ratio = ratio;
            image.groups = image.groups.filter((group) => {
              return ('@' + ratio + 'x') !== group;
            });
            groupName += '@' + ratio + 'x';
          }
        }
        return Promise.resolve(groupName);
      },
      // 转换百分比定位
      hooks: {
        onUpdateRule: function(rule, token, image) {
          var backgroundSizeX = (image.spriteWidth / image.coords.width) * 100;
          var backgroundSizeY = (image.spriteHeight / image.coords.height) * 100;
          var backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
          var backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;
    
          backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
          backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
          backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
          backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;
    
          var backgroundImage = postcss.decl({
            prop: 'background-image',
            value: 'url(' + image.spriteUrl + ')'
          });
    
          var backgroundSize = postcss.decl({
            prop: 'background-size',
            value: backgroundSizeX + '% ' + backgroundSizeY + '%'
          });
    
          var backgroundPosition = postcss.decl({
            prop: 'background-position',
            value: backgroundPositionX + '% ' + backgroundPositionY + '%'
          });
    
          rule.insertAfter(token, backgroundImage);
          rule.insertAfter(backgroundImage, backgroundPosition);
          rule.insertAfter(backgroundPosition, backgroundSize);
        }
      }
    }
    ```
    ```js
    //postcss-config.js
    module.exports = {
      plugins: [
        require('autoprefixer')({
		browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie> 8'] 
        }),
        require('postcss-sprites')(
            require('./postcss-sprites.config')
        )
      ] 
    }
    ```
3. 效果
    ![](https://user-gold-cdn.xitu.io/2019/3/17/1698c4b56844d2dd?w=1738&h=954&f=png&s=291494)

    ![](https://user-gold-cdn.xitu.io/2019/3/18/1698fb9bd472cfc1?w=440&h=440&f=png&s=274496)
### 静态服务器的开启
webpack4 提供了一个devServer 的选项配合我们的服务器配置
我们只需要在配置中写入
```js
...
devServer: {
    contentBase: './dist',
    host: 'localhost',      // 默认是localhost
    port: 3000,             // 端口
    open: true,             // 自动打开浏览器
    hot: true               // 开启热更新
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”
}     //开发服务器设置
...
```
需要注意的是：需要在指定文件插入这行代码才会进行热更新
```js
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
```
#### 跨域处理
以前我们本地开发跨域需要配置什么apache 什么转发什么的，但是在 webpack4 里面我们可以直接在配置开发服务器这里配一个跨域代理转发，这样岂不是更爽
```js
devServer: {
    ... 
    proxy: {
      // 跨域代理转发
      '/api': {
        target: 'https://xxx.xxx.com/xxx',
        pathRewrite: { '^/api': '/' },
        changeOrigin: true,
        logLevel:"debug",
      }
    },
    ...
}
```

### 解析 resolve
`webpack` 提供了 `resolve` 选项供我们配置模块如何被解析。比如我们最常使用到的别名、省略后缀名
```js
...
resolve: {
    // 别名
    alias:{
      main: path.join(__dirname, 'src/main.js')
    },
    //省略后缀名
    extensions:['.js','.json','.less','.scss','.css']
}
...
```
设置之后引入就可以变成这样子，简单来说就是更加快活了，不然你要陷入 `../../../../../` 的无限地狱
```js
//index.js
//before
import './css/style-css.css';
import './less/style-less.less';
import './scss/style-scss.scss';
import 'main.js'
//after
import './css/style-css';
import './less/style-less';
import './scss/style-scss';
import 'main';
```

### 多页面应用的提取公共代码和单页面应用懒加载
#### 提取公共代码
在开发多页面应用的时候，难免要提取公共代码，在 `webpack4` 中可以通过配置 `optimization` 选项中的 `splitChunks` 来实现公共代码的提取。

我们先来准备一些文件。
```js
//utils.js
export default 'utils'

//pageA-main.js
import util from './utils'
export default 'pageA-main-' + util

//pageB-main.js
import util from './utils'
export default 'pageB-main-' + util

//入口文件 pageA 
import pageA from './pageA-main'
import utils from './utils'
import * as _ from 'lodash';
console.log('pageA')
console.log(_.uniq([1,1,2,3,3]))
console.log(pageA,utils)

//入口文件 pageB
import pageA from './pageA-main'
import pageB from './pageB-main'
import * as _ from 'lodash';
console.log('pageB')
console.log(_.uniq([3,3,3,3,3]))
console.log(pageA,pageB)

```
先写一个多页面的入口和出口
```js
...
  entry:{
    pageA:'./src/pageA.js',
    pageB:'./src/pageB.js'
  }, //单页面入口
  output:{
    filename: '[name].js', // 打包后文件名
    path: path.resolve('dist'), // 打包后目录，需为绝对路径
    chunkFilename: "[name].chunk.js"
  },  
...
```
然后我们配置 `optimization`
```js
...
  optimization:{
    splitChunks:{
      cacheGroups:{
        vendor:{
          // 抽离第三方插件 打包node_modules下的第三方包
          test: /node_modules/,
          chunks:'initial',
          // 打包后的文件名，任意命名
          name:'vendor',
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority:10
        },
        utils:{
          // 抽离自己写的公共代码
          chunks:'initial',
          name:'utils',
          minSize:0
        }
      }
    }
  },
...
```
这样配置完成之后其实就已经可以打包出分包的 `js` 文件了，当你需要输出的 `html` 中引用它们的时候，则需要在插件 `html-webpack-plugin` 中指定引用的块
```js
plugins:[
    ...
    new HtmlWebpackPlugin({
      template:'./src/index.html', // 打包目标模板
      filename:'pageA.html',
      chunks:['vendor','utils','pageA']
    }),
    new HtmlWebpackPlugin({
      template:'./src/index.html', // 打包目标模板
      filename:'pageB.html',
      chunks:['vendor','utils','pageB']
    }),
    ...
  ],      
```
提取公共代码之前打包：
![](https://user-gold-cdn.xitu.io/2019/3/18/169908ea77d2203e?w=832&h=356&f=png&s=114545)
提取公共代码之后打包：
![](https://user-gold-cdn.xitu.io/2019/3/18/1699096459bb8d3a?w=831&h=444&f=png&s=84418)
![](https://user-gold-cdn.xitu.io/2019/3/18/16990a7381053f1f?w=350&h=346&f=png&s=120332)
#### 懒加载
在 `webpack` 中除了静态导入还有动态导入模块的方式，可以使用内置的 `import()`，写起来大概是这样子的。
```js
import(
  /* webpackChunkName: "lodash" */ 
  `lodash`).then((_) =>{
    console.log(_.uniq([1,1,2,3,3]))
}) 
```
这里需要装一个 `@babel/plugin-syntax-dynamic-import` 来帮助我们解析
```js
// .babelrc
{
  "presets": ["@babel/preset-env"],   // 从右向左解析
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```
在 `output` 选项中加入 `chunkFilename`
```js
// webpack.config.js
...
output:{,
    path: path.resolve('dist'), // 打包后目录，需为绝对路径
    filename: '[name].[hash:8].js', // 打包后文件名
    chunkFilename: '[name].[hash:8].js'
},  
...
```
![](https://user-gold-cdn.xitu.io/2019/3/19/1699188a139d0dbe?w=875&h=376&f=png&s=69410)
这里其实最核心的一点应用其实在于 js懒加载 ，例如我找个元素，然后让它点击之后才会加载，这样子就能把整个 文件瘦身成很多个小块
```js
window.onload = () => {
  document.getElementById('webpack').onclick = e =>{
    //只有该元素点击的时候才会去拉取这个块
    import(
      /* webpackChunkName: "lodash" */ 
      `lodash`).then((_) =>{
        console.log(_.uniq([1,1,2,3,3]))
    }) 
  }
}
```
懒加载不仅可以用在 js 模块上，css 文件也可以懒加载，只要你想，一切都可以懒
```js
...
import(
  /* webpackChunkName: "style" */ 
  `./scss/style-scss.scss`).then((_) =>{
    console.log('style-load')
}) 
```
![](https://user-gold-cdn.xitu.io/2019/3/19/169918e6c1020f57?w=194&h=198&f=png&s=33622)

### 生产环境跟开发环境
如果你从上面写到这里的话你会发现，整个文件越来越长，越来越大的难以忍受难以看懂，这里为了方便我们开发我们需要把 `webpack.config.js` 拆分成 `webpack.common.js` `webpack.dev.js` 和 `webpack.prod.js` ，然后引用个插件来 复合产生两个文件来供我们两个环境使用
```js
cnpm i -D webpack-merge
```
这里提取文件的思路是，把公共的代码提取到 `webpack.common.js` 中，这里一般配置一些常用的东西，比如 `entry` ，`output`，`module`，`resolve` 这些配置，因为这些配置开发环境跟生产环境通用的东西
```js
// webpack.common.js
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
```
提取出 `webpack.common.js` 之后我们来接着写另外两个
```js
// webpack.dev.js
const common = require('./webpack.common')
const merge = require('webpack-merge')
//配置开发服务器，开发工具等
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
```
```js
// webpack.prod.js
//首先引入插件,插件是一个类,使用的时候需要先 new 
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.common')
const merge = require('webpack-merge')
//配置打包文件，压缩文件，提取文件等操作
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
```
提取出来后去 `package.json` 中配置脚本参数
```json
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js",
    "dev": "webpack-dev-server --config webpack.dev.js"
}
```
这样你就把所有的东西都干完啦。

![](https://user-gold-cdn.xitu.io/2019/3/19/1699467b0a1d1367?w=200&h=148&f=png&s=48093)