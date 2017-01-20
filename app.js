const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');


const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);
const port = process.env.PORT || 3000; //PORT=4000 node app
const app = express();

// const dbUrl = 'mongodb://chicken:3320682@ds021694.mlab.com:21694/articleblog';
const dbUrl = 'mongodb://localhost/blog';
mongoose.connect(dbUrl);

let isDev = process.env.NODE_ENV !== 'production';
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(session({
  //防止篡改cookie
  secret: 'Myblog',
  key: 'blog',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  }, //30 days
  store: new mongoStore({
    url: dbUrl,
    //把session保存到mongodb的collection的sessions里
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}));


app.use((req, res, next) => {
  let _user = req.session.user;
  app.locals.user = _user;
  next();
})

if (isDev) {
  const webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.config.js');

  let compiler = webpack(webpackDevConfig);

  // attach to the compiler & the server
  app.use(webpackDevMiddleware(compiler, {

    // public path should be the same with webpack config
    publicPath: webpackDevConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true
    }
  }));
  app.use(webpackHotMiddleware(compiler));

  const main = require('./configs/main')(app);
  const admin = require('./configs/admin')(app);
  const api = require('./configs/api')(app);
  const manager = require('./configs/manager')(app);
  //模块挂载
  app.use('/', main);
  app.use('/admin', admin);
  app.use('/api', api);
  app.use('/manager', manager);



  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


  // development error handler
  // will print stacktrace
  if (app.get('env') === 'dev') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      console.log(err);
      res.render('error', {
        title: '你来到了一片荒芜之地',
        message: err.message,
        error: err
      });
    });
  }

  // // production error handler
  // // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: '你来到了一片荒芜之地',
      message: err.message,
      error: {}
    });
  });

  let reload = require('reload');
  let http = require('http');

  let server = http.createServer(app);
  reload(server, app);

  server.listen(port, function () {
    console.log('App (dev) is now running on port 3000!');
  });

} else {
  app.use(express.static(path.join(__dirname, 'public')));
  const main = require('./configs/main')(app);
  const admin = require('./configs/admin')(app);
  const api = require('./configs/api')(app);
  const manager = require('./configs/manager')(app);
  //模块挂载
  app.use('/', main);
  app.use('/admin', admin);
  app.use('/api', api);
  app.use('/manager', manager);



  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });


  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      console.log(err);
      res.render('error', {
        title: '你来到了一片荒芜之地',
        message: err.message,
        error: err
      });
    });
  }

  // // production error handler
  // // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err)
    res.render('error', {
      title: '你来到了一片荒芜之地',
      message: err.message,
      error: {}
    });
  });
  app.listen(port);
  console.log('Blog satrt on port:' + port);
  module.exports = app;
}