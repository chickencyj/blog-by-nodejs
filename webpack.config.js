
var path = require('path')
var webpack = require('webpack');

module.exports = {
  entry: {
    index: ['./public/js/common/header.js', './public/js/index.js'],
    article: ['./public/js/common/header.js', './public/js/article.js'],
    articlelist: ['./public/js/common/header.js', './public/js/articlelist.js'],
    author: ['./public/js/common/header.js', './public/js/author.js'],
    login: ['./public/js/common/header.js', './public/js/login.js'],
    register: ['./public/js/common/header.js', './public/js/register.js'],
    result: ['./public/js/common/header.js', './public/js/result.js'],
    tag: ['./public/js/common/header.js', './public/js/tag.js'],
    upload: ['./public/js/common/header.js', './public/js/upload.js'],
    header: ['./public/js/header.js']
  },
  output: {
        path: __dirname + '/public/assets/',
        publicPath: "/public/assets/",
        filename: '[name].js'
  },
  externals: { jquery: "jQuery" },
  watch: false,
  cache: false,//增量编译
  devtool: 'sourcemap',//在output对应文件生成sourcemap,方便我们在浏览器调试
  plugins: [
    new webpack.optimize.DedupePlugin(),//用来检测相似的文件或者文件中重复的内容，然后将这些冗余在output中消除掉
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin(),//用来压缩输出的JavaScript代码
    new webpack.optimize.OccurenceOrderPlugin(),//按照引用频度来排序各个模块，bundleId引用的越频繁Id值越短已便达到减小文件大小的效果
    new webpack.optimize.AggressiveMergingPlugin(), //用来优化生成的代码段，合并相似的trunk，提取公共部分
    new webpack.NoErrorsPlugin()//用来保证编译过程不能出错
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    },
    {
       test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
       loader : 'url?prefix=font/&limit=10000'
    },
    {
    	test: /\.(tpl|ejs)$/, 
    	loader: 'ejs'
    },
    { test: /\.js$/, loader: 'babel', query: {compact: false} },  
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['react', 'es2015']
      }
    }]
  }
}