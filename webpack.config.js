/*
* @Author: fish
* @Date:   2017-09-08 17:30:58
* @Last Modified by:   fish
* @Last Modified time: 2017-09-10 16:07:02
*/

// webpack中自带js加载，所以不用安装loader

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置 dev/online(用于区分是在线上还是开发环境)
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name) {
	return {
    	template : './src/view/' + name + '.html',
    	filename : 'view/' + name + '.html',//生成后存放的路径
    	inject : true,
    	hash : true,
    	chunks : ['common',name]//配置需要打包进html的文件(name对应entry里面的名称)
    }
}
var config = {
	// 适用于单个js文件的入口
    // entry: './src/page/index.js',

    // 如果是多个js文件的入口的话就将它们放到对象中
    entry: {
    	// 通用模块common(后面配置的server是需要显示对应的路径,如果不配置的话不显示下一级的路径
    	//webpack-dev-server --inline --port 8088)1.局部安装 2.全局安装  使用时先打包再运行服务
    	'common' : ['./src/page/common/index.js'],
    	'index' : ['./src/page/index/index.js'],
    	'login' : ['./src/page/login/index.js'],
    },

    output: {
        path: './dist', //存放时的路径
        publicPath:'/dist',//访问时的路径
        //代码改变时页面自动刷新(默认匹配到dist文件下)
        // 这种情况后面的打包会将前面的覆盖掉
        // filename: 'app.js'
        // [name].js -->按照原文件的名字打包进目标文件
        filename:'js/[name].js'
    },
    // 用于加载外部的模块以及变量
    externals : {
    	'jquery' : 'window.jQuery'
    },
    module: {
    	loaders: [
    		// 第一种加载方式require方式引入(将css打包进js文件)
    		// { test: /\.css$/, loader: "style-loader!css-loader" }
    		// 第二种加载方式require方式引入到js中，打包时单独打包，
    		// 配合html模板link引入(单独打包css文件)
    		{ test: /\.css$/, loader:  ExtractTextPlugin.extract("style-loader","css-loader") },
    		//处理打包图片的文件(也匹配后面带参数的文件类型)(后面?limit=100是限制文件的大小,小于100打包成base64的格式放在css文件,大于这个值的话以文件的形式打包)
    		//单独打包的话css中url后面就会自动引入dist中图片的路径,与css在一起打包的时候就会将图片当做字符串打包进css文件
    		//name后面代表的是要打包的文件的路径,[ext]代表文件的扩展名不会发生改变
    		//需要安装url-loader和file-loader(处理图片以及字体文件 前3个图片后3个字体文件)
    		{ test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,loader:'url-loader?limit=100&name=resource/[name].[ext]'}
    	]
  	},

    // 抽取公用模块
    plugins : [
    	// 这里用到了webpack，所以需要require进来
    	// 独立通用js文件
    	new webpack.optimize.CommonsChunkPlugin({
    		// 将common打包进通用模块中
    		name : 'common',
    		// output中配置了path,所以后面所有的输出文件都是基于output中的文件
    		filename : 'js/base.js'
    	}),
    	// 将css单独打包进文件里
    	new ExtractTextPlugin("css/[name].css"),
    	// html模板的处理(这种方式每个html都需要new,所以将它们进行封装)
    	// new HtmlWebpackPlugin({
    	// 	template : './src/view/index.html',
    	// 	filename : 'view/index.html',
    	// 	inject : true,
    	// 	hash : true,
    	// 	chunks : ['common','index']//配置需要打包进html的文件
    	// })

    	//使用封装的函数加载html  (npm安装html-loader)
    	new HtmlWebpackPlugin(getHtmlConfig('index')),
    	new HtmlWebpackPlugin(getHtmlConfig('login')),
    ]
 };

//如果是开发环境就将这个添加到common数组中
if ('dev' === WEBPACK_ENV) {
	config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
// webpack中不会自动清除文件
module.exports = config;