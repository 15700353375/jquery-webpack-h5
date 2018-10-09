var path = require('path')
var webpack = require("webpack")
var autoprefixer = require("autoprefixer")
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
//设置变量
var ROOT_PATH = path.resolve(__dirname,'./');
var SRC_PATH = path.resolve(ROOT_PATH,'src');

module.exports = {
    //入口设置
    entry: {
        app: './app.js',
        css: path.join(SRC_PATH,'/assets/vendor.js')
    },
    //出口设置
    // output告诉Webpack应该在哪里以怎样的方式去放置打包好的文件。它有两个属性：“path”和“publicPath”。
    output: {
        // “publicPath”多被一些Webpack的插件使用，在HTML文件以生产环境方式被构建的时候，更新CSS文件内的URL地址。
        // publicPath: './', 会改变html中引入css和js的路径前部分
        // “path”会简单地告诉Webpack生成文件输出位置
        path: path.resolve(__dirname, './dist'),
        
        // filename 用于输出文件的文件名
        filename: '[name].[hash].bundle.js',
        // 如果开了web-dev-server服务器，当require.ensure方法中引入的模块发生变化,网站中加载的chunk.js文件的hash值会自动变化,而不需要手动重新打包或者重新运行web-dev-server。
        // 因为它会自动重新编译,但现有的chunk.js文件的hash并不会更新，只是网站中加载的chunk.js文件更新了
        chunkFilename: '[name].chunk.js',
    },
    //加载器配置
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader"],
                    fallback: 'style-loader',
                    // 为了处理图标找不到的问题
                    publicPath: './img/'
                }),
            },
            {
              test: /\.less$/,
              use: ExtractTextPlugin.extract({
                use: [ 'css-loader', 'postcss-loader', 'less-loader'],
                fallback: 'style-loader',
                publicPath: './img/',
                
              })
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                    publicPath: './img/'
                }
            }

        ]
    } ,
    devtool: "source-map", // enum
    //配置查找模块的路径和扩展名和别名
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css', '.scss']
    },
    devServer: {
        contentBase: "./",
        historyApiFallback: true,
        hot: true,
        open: true,
        inline: true,
        port: 3375,
        host:"192.168.0.98",
    },

    //插件配置
    plugins:[
        new ExtractTextPlugin({
            filename:'./static/app.css', //命名打包Css文件
            allChunks:true //所有模块css打包
        }),

        //复制static文件到生产目录
        new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, './static'),
            to: 'static',
            ignore: ['.*']
        }
        ]),
        //热加载插件
        new webpack.HotModuleReplacementPlugin(),
        // 打包之前删除之前的dist
        new CleanWebpackPlugin(['dist']),

        //js代码压缩
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        // 提供jquery开发环境
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery',
        }),
        // 入口html文件
        new HtmlWebpackPlugin({
          template: './index.html'
        }),
        // 打包的时候，设置全局变量，方便dev开发环境和生产环境
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
    ]
}
if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        })
    ])
}





/* 备注：目前打包配置有问题。但勉强可以使用，有时间再单单独配置
一、首先index.html是我们的入口文件（目前只适用于单一入口页面）
二、postcss.config.js是配置移动端适配的文件。
三、书写代码的时候一般按照设计图750px的实际px写入即可，会自动给编译成vw。
四、打包 npm run build 之后出现的dist文件里面，对我们有用的只有 index.html和static文件  js文件可自己copy打包前的代码进去。 记得引入jquery。
五、static文件中的map.css文件是无用的  可删除。 */
