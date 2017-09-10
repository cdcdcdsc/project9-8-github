/*
* @Author: fish
* @Date:   2017-09-08 17:21:13
* @Last Modified by:   fish
* @Last Modified time: 2017-09-10 15:45:35
*/
'use strict';

// 1.npm安装完后引入jq,为非全局
// var $ = require('jquery');

// 2.使用外部引入的jq并使用模块化方式引入
// webpack.config中引入jq，模块化
// var $$ = require('jquery');

// $$('body').html('hello index');

// ./代表的是当前路径
// 1.使用之前需要先安装loader,并在webpack.config.js中进行配置，
// webpack会将css文件当做字符串放到js文件中处理(此种方式需要加载js
// 的时候才可以引入，有html的空白等待时间)
require('./index.css');
require('../module.js');
console.log('hello index');





