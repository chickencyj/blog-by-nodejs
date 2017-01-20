const path = require('path')
const webpack = require('webpack')

const publicPath = 'http://localhost:3000/'
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

let devConfig = {
  entry: {
    index: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/index.js', hotMiddlewareScript],
    article: ['./public/js/common/header.js', './public/js/article.js', hotMiddlewareScript],
    articlelist: ['./public/js/common/header.js', './public/js/articlelist.js', hotMiddlewareScript],
    author: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/author.js', hotMiddlewareScript],
    login: ['./public/js/common/header.js', './public/js/login.js', hotMiddlewareScript],
    register: ['./public/js/common/header.js', './public/js/register.js', hotMiddlewareScript],
    result: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/result.js', hotMiddlewareScript],
    tag: ['./public/js/common/header.js', './public/js/common/top_click.js', './public/js/tag.js', hotMiddlewareScript],
    upload: ['./public/js/common/header.js', './public/js/upload.js', hotMiddlewareScript],
    manager: ['./public/js/common/header.js', './public/js/manager.js', hotMiddlewareScript],
    config: ['./public/js/common/header.js', './public/js/config.js', hotMiddlewareScript],
    header: ['./public/js/header.js', hotMiddlewareScript]
  },
  output: {
    path: __dirname + '/public/',
    filename: './assets/[name].js',
    publicPath: publicPath
  },
  externals: {
    jquery: "window.$"
  },
  // devtool: 'sourcemap', //在output对应文件生成sourcemap,方便我们在浏览器调试
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
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/index.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/article.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/admin/articlelist.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/author.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/login.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/register.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/result.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/main/tag.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/admin/setavator.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/admin/password.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/admin/setprofile.ejs'
    // }),
    // new HtmlWebpackPlugin({
    //   template: './app/views/manager/config.ejs'
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        use: 'url?prefix=font/&limit=10000&name=images/[name].[ext]'
      },
      // {
      //   test: /\.ejs$/,
      //   use: 'raw-loader'
      // },
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