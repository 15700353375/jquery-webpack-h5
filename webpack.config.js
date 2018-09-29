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
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    //加载器配置
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [ 'css-loader'],
                    fallback: 'style-loader'
                  })
                // use: [
                //     'style-loader',
                //     'css-loader'
                // ]
            },
            {
              test: /\.less$/,
              use: ExtractTextPlugin.extract({
                use: [ 'css-loader', 'postcss-loader', 'less-loader'],
                fallback: 'style-loader'
              })
            //   use: [ 'style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
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
            filename:'./app.css', //命名打包Css文件
            allChunks:true //所有模块css打包
          }),
        new CopyWebpackPlugin([//复制static文件到生产目录
        {
            from: path.resolve(__dirname, './static'),
            to: 'static',
            ignore: ['.*']
        }
        ]),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.UglifyJsPlugin({//js代码压缩
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery',
        }),
        new HtmlWebpackPlugin({
          template: './index.html'
        }),
        // new HtmlWebpackPlugin({
        //     template: './attend.html'
        //   }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        autoprefixer
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

