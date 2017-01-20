const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

let devConfig = {
  entry: {
    index: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/index.js'],
    article: ['./public/js/common/header.js', './public/js/article.js'],
    articlelist: ['./public/js/common/header.js', './public/js/articlelist.js'],
    author: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/author.js'],
    login: ['./public/js/common/header.js', './public/js/login.js'],
    register: ['./public/js/common/header.js', './public/js/register.js'],
    result: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/result.js'],
    tag: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/tag.js'],
    upload: ['./public/js/common/header.js', './public/js/upload.js'],
    manager: ['./public/js/common/header.js', './public/js/manager.js'],
    config: ['./public/js/common/header.js', './public/js/config.js'],
    header: ['./public/js/header.js']
  },
  output: {
    path: __dirname + '/public/assets/',
    filename: '[name].js'
  },
  externals: {
    jquery: "window.$"
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new LoaderOptionsPlugin({
      // debug: true,
      options: {

        /**
         * Static analysis linter for TypeScript advanced options configuration
         * Description: An extensible linter for the TypeScript language.
         *
         * See: https://github.com/wbuchwalter/tslint-loader
         */
        // tslint: {
        //   emitErrors: false,
        //   failOnHint: false,
        //   resourcePath: 'client'
        // },

      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin(),//用来压缩输出的JavaScript代码
    new webpack.optimize.OccurrenceOrderPlugin(),//按照引用频度来排序各个模块，bundleId引用的越频繁Id值越短已便达到减小文件大小的效果
    new webpack.optimize.AggressiveMergingPlugin(), //用来优化生成的代码段，合并相似的trunk，提取公共部分
    new webpack.NoErrorsPlugin()//用来保证编译过程不能出错
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        use: 'url?prefix=font/&limit=10000'
      },
      {
        test: /\.(tpl|ejs)$/,
        use: 'ejs'
      },
      {
        test: /\.js$/,
        use: [
        {
          loader: 'babel-loader',
          options: {
            compact: false
          }
        }]
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }]
      }
    ]
  }
}

module.exports = devConfig