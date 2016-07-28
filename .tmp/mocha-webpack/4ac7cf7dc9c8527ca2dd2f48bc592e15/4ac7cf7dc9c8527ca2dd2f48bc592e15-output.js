/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	    var testsContext = __webpack_require__(1);

	    var runnable = testsContext.keys();

	    runnable.forEach(testsContext);
	    

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./article/article.test.js": 2,
		"./tag/tag.test.js": 40,
		"./user/user.test.js": 41
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var crypto = __webpack_require__(3)

	function getRandomString(len) {
	  if (!len) len = 16

	  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
	}

	var should = __webpack_require__(4)
	var app = __webpack_require__(5)
	var Article = __webpack_require__(18)

	var article

	// test
	describe('<Unit Test', function() {
	  describe('Model Article:', function() {
	    before(function(done) {
	      article = {
	        title: getRandomString(),
	        text: 'articleText'
	      }

	      done()
	    })
	   })

	    describe('Article save', function() {
	      it('should save without problems', function(done) {
	        var _article = new Article(article)

	        _article.save(function(err) {
	          should.not.exist(err)
	          _article.remove(function(err) {
	            should.not.exist(err)
	            done()
	          })
	        })
	      })

	      it('should have default pv 0', function(done) {
	        var _article = new Article(article)

	        _article.save(function(err) {
	          _article.pv.should.equal(0)

	          _article.remove(function(err) {
	            done()
	          })
	        })
	      })

	    after(function(done) {
	      // clear article info
	      done()
	    })
	  })
	})

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("should");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(6);
	const path = __webpack_require__(7);
	const favicon = __webpack_require__(8);
	const logger = __webpack_require__(9);
	const cookieParser = __webpack_require__(10);
	const bodyParser = __webpack_require__(11);
	const session = __webpack_require__(12);


	const mongoose = __webpack_require__(13);
	const mongoStore = __webpack_require__(14)(session);
	const port = process.env.PORT || 8080;//PORT=4000 node app
	const app = express();


	// const dbUrl = 'mongodb://chicken:3320682@ds021694.mlab.com:21694/articleblog';
	const dbUrl = 'mongodb://localhost/blog';
	mongoose.connect(dbUrl);


	// view engine setup



	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	// app.use(favicon(__dirname + '/public/images/me.jpg'));



	app.use(session({
	  //防止篡改cookie
	  secret: 'Myblog',
	  key : 'blog',
	  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
	  store: new mongoStore({
	    url: dbUrl,
	    //把session保存到mongodb的collection的sessions里
	    collection: 'sessions'
	  })
	}));


	//动态视图助手，本地变量
	app.locals.moment = __webpack_require__(15);


	const main = __webpack_require__(16)(app);
	const admin = __webpack_require__(27)(app);
	const api = __webpack_require__(30)(app);
	const manager = __webpack_require__(37)(app);
	//模块挂载
	app.use('/', main);
	app.use('/admin', admin);
	app.use('/api', api);
	app.use('/manager', manager);



	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	// error handlers
	app.set('views', path.join(__dirname, './app/views'));
	app.set('view engine', 'ejs');
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
	}

	// // production error handler
	// // no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});

	app.listen(port);
	console.log('Blog satrt on port:' + port);
	module.exports = app;

	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("serve-favicon");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("connect-mongo");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {
	const express = __webpack_require__(6);
	const mainApp = express();
	const path = __webpack_require__(7);
	mainApp.locals.moment = __webpack_require__(15);

	let main = (app) => {

	mainApp.set('views', path.join(__dirname, '../app/views/main'));
	mainApp.set('view engine', 'ejs');


	mainApp.use( (req, res, next) => {
	  let _user = req.session.user;
	  mainApp.locals.user = _user;
	  next();
	})


		//路由模块
		const routers = {
			main: __webpack_require__(17),
			user: __webpack_require__(26)
		};

		//主模块
		mainApp.use( '/', routers.main );
		//用户模块
		mainApp.use('/user', routers.user);
	 
		return mainApp;
	}

	module.exports = main;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	const express = __webpack_require__(6),
				router = express.Router(),
				Article = __webpack_require__(18),
				User = __webpack_require__(20),
				Tag = __webpack_require__(23),
				marked = __webpack_require__(25);

	let re = /<[^>]*>/g;

	router.get('/', (req, res, next) => {
		let page = 0,
				len,
				title;
	  const count = 6;
	  let index = count * page;
	  Article.count((err, count) => {
	  	if (err) {
	  		console.log(err);
	  	};
	  	len = count;
	  });
		Article
		.find({})
		.sort({'meta.createTime':-1})
		.limit(count)
		.skip(index)
		.populate('author')
		.populate('tag')
		.exec((err, articles) => {
			articles.forEach((article,index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re,'');
				if (article.text.length > 300) {
					article.text = article.text.substring(0,300);
					article.text = article.text + ' ...';
				}
			})
			if (req.session.user && req.session.user.signature) {
				title = req.session.user.signature;
			} else {
				title = 'play and have fun'
			}
			res.render('index', { 
				title: title,
				len: len,
				page: page,
				articles: articles
			});
		})
	})

	router.get('/author/:id', (req, res, next) => {
		let id = req.params.id,
				page = 0,
				len,
				title;
	  const count = 6;
	  let index = count * page;
		User
		.findById({_id: id})
		.populate('articles')
		.exec((err, user) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			len = user.articles.length;
			user.articles.sort((a,b)=> {
				return b.meta.createTime-a.meta.createTime;
			})
			user.articles = user.articles.slice(index,index+count);
			user.articles.forEach((article,index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re,'');
				if (article.text.length > 300) {
					article.text = article.text.substring(0,300);
					article.text = article.text + ' ...';
				}
			})
			if (user.signature) {
				title = user.signature;
			} else {
				title = user.name;
			}

			res.render('author', {
				title: title,
				len: len,
				page: page,
				User: user
			})
		})
	})

	router.get('/article/:id', (req, res, next) => {
		let id = req.params.id,
				preArticle,
				nextArticle,
				len;
		Tag.find({}).sort({'articles':-1}).limit(10).then((tags) => {
			Article.find({}).sort({'meta.createTime':-1}).then((articles) => {
				return articles;
			}).then((articles)=>{
				Article.update({_id:id}, {$inc: {pv: 1}}, function (err) {
					if (err) {
						console.log(err);  
					};
				})
				Article
				.findById({_id: id})
				.populate('author')
				.populate('tag')
				.exec((err, article) => {
					console.log(article);
					User.update({_id: article.author._id}, {$inc: {pv: 1}}, function (err) {
					if (err) {
							console.log(err);  
						}
					})
				
					for(let i = 0; i < articles.length; i++) {
						if (articles[i]._id.toString() == id) {
							if (i === 0) {
								preArticle = false;
								nextArticle = articles[i+1];
							} else if (i === articles.length-1) {
								preArticle = articles[i-1];
								nextArticle = false;
							} else {
								preArticle = articles[i-1];
								nextArticle = articles[i+1];
								break;
							}
						}
					}
					len = articles.length;
					articles.sort(function(a,b){
						return b.pv-a.pv;
					})
					articles = articles.slice(0,10);
					article.text = marked(article.text);
					console.log(article.text);
					res.render('article', {
						title: article.title,
						article: article,
						articles: articles,
						preArticle: preArticle,
						nextArticle: nextArticle,
						tags: tags,
						len: len
					})
				})
			})
		})
	})

	router.get('/article/tag/:id', (req, res, next) => {
			let id = req.params.id,
				page = parseInt(req.query.p, 10) || 0,
		    len;
		const count = 6;
		let index = count * page;
		Tag.findById({_id: id}).populate('articles').then((tag) => {
			Tag.find({}, (err, tags) => {
				if (err) {
						console.log(err);
					};
				len = tag.articles.length;
				tag.articles = tag.articles.slice(index,index+count);
				res.render('tag', {
					title: tag.name,
					tags: tags,
					tag: tag
				})
			})
		})
	})

	router.get('/results', (req, res, next) => {
		let q = req.query.q,
				page = parseInt(req.query.p, 10) || 0,
		    len;
		const count = 6;
		let index = count * page;
		Article.count((err, count) => {
	  	if (err) {
	  		console.log(err);
	  	};
	  	len = count;
	  });
		Tag.find({}).then((tags) => {
			Article
			.find({title: new RegExp(q + '.*', 'i')})
			.limit(count)
			.skip(index)
			.exec((err, articles) => {
				if (err) {
					console.log(err);
					return res.redirect('/');
				}

					// user.articles.forEach(function (doc) {
					//   doc.text = markdown.toHTML(doc.text);
					// });
				res.render('result', {
					title: q,
					len: len,
					tags:tags,
					page: page,
					articles: articles
				})
			})
		})
	})



	module.exports = router;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const ArticleSchema = __webpack_require__(19);
	/**
	 * [Movie description] 编译生成movie模型
	 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
	 */
	const Article = mongoose.model('Article', ArticleSchema);

	module.exports = Article;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const Schema = mongoose.Schema;
	const ObjectId = Schema.Types.ObjectId;

	const ArticleSchema = new mongoose.Schema({
		author: {type: ObjectId, ref: 'User'},
		title: String,
		text: String,
		tag: {type: ObjectId, ref: 'Tag'},
		pv: {
			type: Number,
			default: 0
		},
		meta: {
			createTime: {
				type: Date,
				default:Date.now()
			},
			updateTime: {
				type: Date,
				default:Date.now()
			}
		}
	})
	ArticleSchema.pre('save', function (next) {
		//判断数据是否是新加的
		if(this.isNew) {
			this.meta.createTime = this.meta.update = Date.now();
		} else {
			this.meta,updateTime = Date.now()
		}

		next();
	})

	ArticleSchema.statics = {
		//用来查找数据库里所有数据
		fetch: function(cb) {
			return this
				.find({})
				.sort('meta.updateTime') //按照更新时间排序
				.exec(cb) 	//执行回调方法
		}
		// //用来查询单条数据
		// findById: function(id, cb) {
		// 	return this
		// 		.findOne({_id:id})
		// 		.exec(cb) 	//执行回调方法
		// }
	}

	module.exports = ArticleSchema;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const UserSchema = __webpack_require__(21);
	/**
	 * [Movie description] 编译生成movie模型
	 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
	 */
	let User = mongoose.model('User', UserSchema);


	User.prototype.matchRegexp = {
		name: /^\w{3,20}$/,
		password: /^.{3,20}$/,
		email: /^\w+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/
	}

	//无效用户名
	User.prototype.USERNAME_IS_NOT_VALIDATE = Symbol();
	//用户名已经注册
	User.prototype.USERNAME_IS_TO_BE_USED = Symbol();
	//无效密码
	User.prototype.PASSWORD_IS_NOT_VALIDATE = Symbol();
	//两次密码不一致
	User.prototype.TWO_PASSWORD_IS_NOT_MATCH = Symbol();
	//无效email
	User.prototype.EMAIL_IS_NOT_VALIDATE = Symbol();
	//邮箱已经注册
	User.prototype.EMAIL_IS_TO_BE_USED = Symbol();

	/**
	 * 用户注册
	 * @return {[type]} [description]
	 */
	User.prototype.register = function() {
		return new Promise( (resolve, reject) => {
			if ( !this.verifyUserName() ) {
				return reject(this.USERNAME_IS_NOT_VALIDATE);
			}
			if ( !this.verifyPassWord() ) {
				return reject(this.PASSWORD_IS_NOT_VALIDATE);
			}
			if ( this.password !== this.confirmpwd) {
				return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
			}
			if ( !this.verifyEmail() ) {
				return reject(this.EMAIL_IS_NOT_VALIDATE);
			}

			resolve();
		}).then( () => {
			return this.getUserInfoByUserName(this.name).then( userInfo => {
				if (userInfo) {
					return Promise.reject( this.USERNAME_IS_TO_BE_USED );
				} else {
					return Promise.resolve();
				}
			});
		}).then( () => {
			return this.getUserInfoByEmail(this.email).then( userInfo => {
				if (userInfo) {
					return Promise.reject(this.EMAIL_IS_TO_BE_USED);
				} else {
					return Promise.resolve();
				}
			} )
		} ).then( () => {
			return this.save();
		} )
	}

	User.prototype.resetPwd = function() {
		return new Promise( (resolve, reject) => {
			if ( !this.verifyPassWord() ) {
				return reject(this.PASSWORD_IS_NOT_VALIDATE);
			}
			if ( this.password !== this.confirmpwd) {
				return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
			}
			resolve();
		}).then( () => {
			return this.save();
		})
	}
	/*
	* 用户登录
	* */
	// User.prototype.login = function() {
	// 	return new Promise( (resolve, reject) => {
	// 		this.type = ['name','email'].indexOf(this.type) != -1 ? this.type : 'name';
	// 		if (this.type == 'name') {
	// 			return this.getUserInfoByUserName(this.account).then( userInfo => {
	// 				if (userInfo) {
	// 					//存在该用户
	// 					console.log(userInfo.password, this.password)
	// 					if (userInfo.password == this.password) {
	// 						return resolve(userInfo);
	// 					} else {
	// 						//密码错误
	// 						return reject();
	// 					}
	// 				} else {
	// 					return reject();
	// 				}
	// 			} )
	// 		} else {
	// 			return this.getUserInfoByEmail(this.account).then( userInfo => {
	// 				if (userInfo) {
	// 					//存在该用户
	// 					if (userInfo.password == this.password) {
	// 						return resolve(userInfo);
	// 					} else {
	// 						//密码错误
	// 						return reject();
	// 					}
	// 				} else {
	// 					return reject();
	// 				}
	// 			} )
	// 		}
	// 	});
	// }

	/**
	 * 验证用户名
	 * @return {[type]} [description]
	 */
	User.prototype.verifyUserName = function() {
		return this.matchRegexp.name.test(this.name);
	}
	/**
	 * 验证密码
	 * @return {[type]} [description]
	 */
	User.prototype.verifyPassWord = function() {
		return this.matchRegexp.password.test(this.password);
	}
	/**
	 * 验证邮箱
	 * @return {[type]} [description]
	 */
	User.prototype.verifyEmail = function() {
		return this.matchRegexp.email.test(this.email);
	}
	/**
	 * 通过用户 USERNAME 获取用户信息
	 * @return {[type]} [description]
	 */
	User.prototype.getUserInfoByUserName = function(name) {
		return User.findOne({
			name: name
		}).exec();
	}
	/**
	 * 通过用户 EMAIL 获取用户信息
	 * @return {[type]} [description]
	 */
	User.prototype.getUserInfoByEmail = function(email) {
		return User.findOne({
			email: email
		}).exec();
	}
	/**
	 * 通过用户 uid 获取用户信息
	 * @return {[type]} [description]
	 */
	User.prototype.getUserInfoById = function(uid) {
		return User.findOne({
			_id: uid
		}).exec();
	}

	module.exports = User;



/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const Schema = mongoose.Schema;
	const ObjectId = Schema.Types.ObjectId;
	//专门为密码存储设计的算法
	//先生成一个随机的盐，然后将密码和盐混合进行加密，就拿到了最终存储的密码
	const bcrypt = __webpack_require__(22);
	let SALT_WORK_FACTORY = 10;

	const UserSchema = new mongoose.Schema({
		//一般网站保护密码最好的密码是加盐密码哈希后的值
		//哈希算法将任意长度的二进制值映射为较短的固定长度的二进制值，这个小的二进制值称为哈希值。
		//过程不可逆（md5）
		name: {
			//唯一
			unique: true,
			type: String
		},
		email: {
			unique: true,
			type: String
		},
		password: String,
		articles: [{type: ObjectId, ref: 'Article'}],
		pv: String,
		head: String,
		poster: String,
		signature: String,
		avator: String,
		//0:normal  1:verified 2:advance
		//>10: admin
		///>50: super admin 
		role: {
			type: Number,
			default: 0
		},
		meta: {
			createTime: {
				type: Date,
				default:Date.now()
			},
			updateTime: {
				type: Date,
				default:Date.now()
			}
		}
	})
	// //每次存储数据之前都会去调用这个方法
	// UserSchema.pre('save', function (next) {
	// 	var user = this;
	// 	//判断数据是否是新加的
	// 	if(this.isNew) {
	// 		this.meta.createTime = this.meta.update = Date.now();
	// 	} else {
	// 		this.meta.updateTime = Date.now()
	// 	}
	// 	//生成一个随机的盐,接受两个参数，第一个为计算强度，第二个为cb,cb中参数可拿到生成后的salt
	// 	bcrypt.genSalt(SALT_WORK_FACTORY, function (err,salt) {
	// 		//如果有错误，通过next传入下个流程
	// 		if(err) {
	// 			return next(err);
	// 		}
	// 		//hash接受三个参数,第三个参数拿到生成后的hash
	// 		bcrypt.hash(user.password, salt, function (err,hash) {
	// 			if (err) {
	// 				return next(err);
	// 			}
	// 			console.log("hash:"+hash);
	// 			//将hash保存到user.password
	// 			user.password = hash;
	// 			console.log(this.password+':'+user.password);
	// 			//进入下一个流程
	// 			next();
	// 		})
	// 	})	
	// 	next();
	// })
	// //实例方法,实例才可调用
	// UserSchema.methods = {
		
	//   comparePassword: function(_password, cb) {
	//   	var _this = this;
	//   	bcrypt.hash(_this.password,SALT_WORK_FACTORY,function(err,hash){
	//   		if (err) {
	//   			console.log(err);
	//   		}
	//   		bcrypt.compare(_password, hash, function(err, isMatch) {
	// 	      if (err) return cb(err);

	// 	      cb(null, isMatch);
	//     	})
	//   	})
	    
	//   }
	// }

	//每次存储数据之前都会去调用这个方法
	UserSchema.pre('save', function(next) {
	  var user = this
	  //判断数据是否是新加的
	  if (this.isNew) {
	    this.meta.createAt = this.meta.updateAt = Date.now()
	  }
	  else {
	    this.meta.updateAt = Date.now()
	  }
	  //生成一个随机的盐,接受两个参数，第一个为计算强度，第二个为cb,cb中参数可拿到生成后的salt
	  bcrypt.genSalt(SALT_WORK_FACTORY, function(err, salt) {
	    if (err) return next(err)
	    //hash接受三个参数,第三个参数拿到生成后的hash
	    bcrypt.hash(user.password, salt, function(err, hash) {
	      if (err) return next(err)

	      user.password = hash
	      next()
	    })
	  })
	})
	//实例方法,实例才可调用
	UserSchema.methods = {
	  comparePassword: function(_password, cb) {
	    bcrypt.compare(_password, this.password, function(err, isMatch) {
	      if (err) return cb(err)

	      cb(null, isMatch)
	    })
	  }
	}

	// //只有进行模型编译实例化以后才能有这些方法
	// UserSchema.statics = {
	// 	//用来查找数据库里所有数据
	// 	fetch: function(cb) {
	// 		return this
	// 			.find({})
	// 			.sort('meta.updateTime') //按照更新时间排序
	// 			.exec(cb) 	//执行回调方法
	// 	},
	// 	//用来查询单条数据
	// 	findById: function(id, cb) {
	// 		return this
	// 			.findOne({_id:id})
	// 			.exec(cb) 	//执行回调方法
	// 	}
	// }
	module.exports = UserSchema;

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("bcrypt");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const TagSchema = __webpack_require__(24);
	/**
	 * [Movie description] 编译生成movie模型
	 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
	 */
	const Tag = mongoose.model('Tag', TagSchema);

	module.exports = Tag;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const Schema = mongoose.Schema;
	const ObjectId = Schema.Types.ObjectId;

	const TagSchema = new mongoose.Schema({
		name: {
			//唯一
			unique: true,
			type: String
		},
		articles: [{type: ObjectId, ref: 'Article'}],
		meta: {
			createTime: {
				type: Date,
				default:Date.now()
			},
			updateTime: {
				type: Date,
				default:Date.now()
			}
		}
	})

	TagSchema.pre('save', function (next) {
		//判断数据是否是新加的
		if(this.isNew) {
			this.meta.createTime = this.meta.update = Date.now();
		} else {
			this.meta,updateTime = Date.now()
		}

		next();
	})

	// ArticleSchema.statics = {
	// 	//用来查找数据库里所有数据
	// 	fetch: function(cb) {
	// 		return this
	// 			.find({})
	// 			.sort('meta.updateTime') //按照更新时间排序
	// 			.exec(cb) 	//执行回调方法
	// 	},
	// 	//用来查询单条数据
	// 	findById: function(id, cb) {
	// 		return this
	// 			.findOne({_id:id})
	// 			.exec(cb) 	//执行回调方法
	// 	}
	// }

	module.exports = TagSchema;

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("marked");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	const express = __webpack_require__(6),
				router = express.Router();

	router.get('/login', (req, res, next) => {
		res.render('login', {
			title: '登录',
			message: false,
			user: req.session.user
		})
	})

	router.get('/reg', (req, res, next) => {
		res.render('register',{
			title: '注册',
			message: false
		})
	})

	module.exports = router;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {
	const express = __webpack_require__(6);
	const adminApp = express();
	const path = __webpack_require__(7);
			

	let admin = (app) => {

		adminApp.set('views', path.join(__dirname, '../app/views/admin'));
		adminApp.set('view engine', 'ejs');

		adminApp.use( (req, res, next) => {
		  let _user = req.session.user;
		  adminApp.locals.user = _user;
		  next();
		})
		
		adminApp.use( (req, res, next) => {
			let user = req.session.user;
			if (!user) {
				return res.redirect('/user/login')
			}
			next();
		} )

		//路由模块
		const routers = {
			article: __webpack_require__(28),
			user: __webpack_require__(29)
		};

		adminApp.use( '/article', routers.article );
		adminApp.use( '/user', routers.user);


		return adminApp;

	}

	module.exports = admin;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	const express = __webpack_require__(6);
	const router = express.Router();
	const Article = __webpack_require__(18);

	/**
	 * 首页
	 */
	router.get('/post', (req, res, next) => {
		res.render('post',{
			title: '发表文章',
			article: {}
		})
	})


	router.get('author/:id', (req, res, next) => {
		let id = req.params.id;
		if (req.session.user._id !== id && req.session.user.role < 50) {
			return res.redirect('back');
		};
		Article
		.find({author: id})
		.sort({'meta.createTime':-1})
		.populate('author')
		.populate('tag')
		.exec((err, articles) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			res.render('articlelist', {
				title: '文章列表',
				articles: articles
			})
		})
	})

	router.get('/edit/:id', (req, res, next) => {
		let id = req.params.id;
		if (id) {
			Article
			.findById({_id: id})
			.populate('tag')
			.exec((err, article)=> {
				if (req.session.user._Id !== article.user && req.session.user.role < 50) {
					return res.redirect('back');
				};
				res.render('post',{
					title: '发表文章',
					article: article
				})
			})
		}
	})

	module.exports = router;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	
	const User = __webpack_require__(20);
	const express = __webpack_require__(6);
	const router = express.Router();


	router.get('/setprofile', (req, res, next) => {
		User
		.findOne({_id: req.session.user})
		.exec((err, user) => {
			res.render('setprofile', {
				title: '管理',
				User: user
			})
		})
	})


	router.get('/setavator', (req, res) => {
		User
		.findOne({_id: req.session.user})
		.exec((err, user) => {
			res.render('setavator', {
				title: '管理',
				User: user
			})
		})
	})

	router.get('/resetpwd', (req, res) => {
		User
		.findOne({_id: req.session.user})
		.exec((err, user) => {
			res.render('password', {
				title: '管理',
				User: user,
				message:false
			})
		})
	})


	module.exports = router;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {
	const express = __webpack_require__(6);
	const apiApp = express();
	const path = __webpack_require__(7);
			

	let api = (app) => {
		
		apiApp.set('views', path.join(__dirname, '../app/views/main'));
		apiApp.set('view engine', 'ejs');


		apiApp.use( (req, res, next) => {
		  let _user = req.session.user;
		  apiApp.locals.user = _user;
		  next();
		})
		//路由模块
		const routers = {
			main: __webpack_require__(31),
			user: __webpack_require__(35),
			showmore: __webpack_require__(36)
		};
		//主模块
		apiApp.use( '/', routers.main );
		//用户模块
		apiApp.use('/user', routers.user);

		apiApp.use('/showmore', routers.showmore);

		return apiApp;
	}

	module.exports = api;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {const express = __webpack_require__(6),
				router = express.Router(),
				Article = __webpack_require__(18),
				User = __webpack_require__(20),
				Tag = __webpack_require__(23),
				marked = __webpack_require__(25),
				_ = __webpack_require__(32),
				multer  = __webpack_require__(33),
				fs = __webpack_require__(34),
				Path = __webpack_require__(7);


	let storage = multer.diskStorage({
	    destination: function (req, file, cb) {
	        cb(null, './public/images')
	    },
	    filename: function (req, file, cb) {
	        console.log(file.originalname);
	        let ext = file.originalname.substring( file.originalname.lastIndexOf('.') );
	        cb(null, Date.now() + ext);
	    }
	})

	let upload = multer({ storage: storage });
	upload = upload.single('f');




	router.post('/post', (req, res, next) => {
		let articleObj = req.body.article,
				_title = articleObj.title,
				_text = articleObj.text,
				_tag = articleObj.tag,
				_id = articleObj._id,
				currentUser = req.session.user,
				_article;
		//文章存在即修改文章
		if (_id) {
			//标签名唯一，所以用名字查找
			Tag.findOne({name: _tag}, (err, tag) => {
				//已经有标签
				if (tag) {
					Article.findById({_id: _id}).then((article) => {
						//判断更新的标签名是否与文章原本标签一致
						if (article.tag.toString() == tag._id) {
							articleObj.tag = article.tag;
						} else {
							//不相同则修改文章tag对象并且在Tag中修改
							articleObj.tag = tag._id;
							Tag.findOne({_id: article.tag}).then((tag) => {
								//tag不存在则删除旧的tag中这篇文章id
								for(let i = 0; i < tag.articles.length; i++ ) {
									if (tag.articles[i].toString() == article._id) {
										tag.articles.splice(i,1);
										break;
									}
								}
								if (!tag.articles.length) {
									Tag.remove({_id: tag._id},(err, tag) => {
										if (err) {
											console.log(err);
										};
									})
								} else {
									tag.save((err, _tag) => {
										if (err) {
											console.log(err);
											return res.redirect('/admin/article/post');
										}
									})
								}		
							}).then(() => {
								Tag.findById({_id: tag._id}).then((tag) => {
									tag.articles.push(article._id);
									tag.save((err, _tag) => {
										if (err) {
											console.log(err);
											return res.redirect('/admin/article/post');
										}
									})
								})
							})
						}
						//underscore里extend方法，另外一个对象新的字段替换掉老的对象的字段
						_article = _.extend(article, articleObj);
						_article.save((err, article) => {
							if (err) {
								console.log(err);
								return res.redirect('/admin/article/post');
							}
							res.redirect('/article/' + article._id);
						})
					}) 
				} else {
						let tagname = _tag;
						//找到文章
						Article.findById({_id: _id}).then((article) => {
							//找到标签并移除里面存储的文章
							Tag.findOne({_id: article.tag}).then((tag) => {
								//tag不存在则删除旧的tag中这篇文章id
								for(let i = 0; i < tag.articles.length; i++ ) {
									if (tag.articles[i].toString() == article._id) {
										tag.articles.splice(i,1);
										break;
									}
								}
								if (!tag.articles.length) {
									Tag.remove({_id: article.tag},(err, tag) => {
										if (err) {
											console.log(err);
										};
									})
								} else {
									tag.save((err, _tag) => {
										if (err) {
											console.log(err);
											return res.redirect('/admin/article/post');
										}
									})
								}
							}).then(() => {
								Article.findById({_id: _id}).then((article) => {
									if (err) {
										console.log(err);
										return res.redirect('/admin/article/post');
									}						
									//创建新tag，保存文章id			
									let _tag = new Tag({name: tagname});
									_tag.articles.push(_id);
									articleObj.tag = _tag._id;
									//underscore里extend方法，另外一个对象新的字段替换掉老的对象的字段
									_article = _.extend(article, articleObj);		
									_tag.save((err, _tag) => {
										if (err) {
											console.log(err);
											return res.redirect('/admin/article/post');
										}
										_article.save((err, article) => {
											if (err) {
												console.log(err);
												return res.redirect('/admin/article/post');
											}
											return res.redirect('/article/' + article._id);
											console.log('181');
										})
									})
								})
							})
						})
					}
				})
		} else {
			console.log('197');
			//在查找里面_tag会被改变因此要在这边赋值？？？？？
			let tagname = _tag;
			Tag.findOne({name: _tag}, (err, tag) => {
				console.log('201');
				if (err) {
					console.log(err);
				};
				if (!tag) {
					let _tag = new Tag({name: tagname});
					let	_article = new Article({author:currentUser, title:_title, text:_text, tag:_tag._id});
					_tag.articles.push(_article._id);
					_tag.save((err, tag) => {
						if (err) {
							console.log(err);
							return res.redirect('/admin/article/post');
						}
						//存储article
						_article.save((err, article) => {
							if (err) {
								console.log(err);
								return res.redirect('/admin/article/post');
							}
							//找到当前用户并在其实例中的articles属性中添加发表的文章id并存储
							User.findById(currentUser, (err, user) => {
								if (err) {
									console.log(err);
									return res.redirect('/admin/article/post');
								}
								user.articles.push(article._id);
								user.save((err, user) => {
									if (err) {
										console.log(err);
										return res.redirect('/admin/article/post');
									}
									res.redirect('/article/' + article._id);
								})
							})
						})
					})
				} else {
					let	_article = new Article({author:currentUser, title:_title, text:_text, tag:tag._id});
					tag.articles.push(_article._id);
					tag.save((err, tag) => {
						if (err) {
							console.log(err);
							return res.redirect('/admin/article/post');
						}
					//存储article
						_article.save((err, article) => {
							if (err) {
								console.log(err);
								return res.redirect('/admin/article/post');
							}
					
							//找到当前用户并在其实例中的articles属性中添加发表的文章id并存储
							User.findById(currentUser, (err, user) => {
								if (err) {
									console.log(err);
									return res.redirect('/admin/article/post');
								}
								user.articles.push(article._id);
								user.save((err, user) => {
									if (err) {
										console.log(err);
										return res.redirect('/admin/article/post');
									}
									res.redirect('/article/' + article._id);
								})
							})
						})
					})
				}
			})		
		}
	})

	router.post('/signature', (req, res, next) => {
		let _user = req.body.user,
				_name = _user.name,
				_signature = _user.signature;
		User
		.findOne({_id: req.session.user})
		.exec((err, user) => {
			user.name = _name;
			if(_signature) {
				user.signature = _signature;
			}
			user.save((err, user) => {
				if (err) {
					console.log(err);
				}
				req.session.user = user;
				res.redirect('/');
			})
		})
	})


	router.post('/avator', (req, res, next) => {
		upload(req, res, (err) => {
			User
			.findOne({_id: req.session.user}) 
			.exec((err, user) => {
				if (user.avator) {
					let preavator = user.avator;
					fs.unlinkSync(Path.join(__dirname, '../../public/images/'+preavator));
				}
				user.avator = req.file.filename;
				user.save((err, user) => {
					if (err) {
						console.log(err);
					}
					req.session.user = user;
					let path = req.file.path.substring(req.file.path.indexOf('/'))
					res.json({
		        errorCode : 0,
		        message: '上传成功',
		        path: path
		    	})
				})
			})
		})
	})

	router.post('/pwd', (req, res, next) => {
		let _user = req.body.user,
				_password = _user.password,
				_newpwd = _user.newpwd,
				_confirmpwd = _user.confirmpwd;
		User.findOne({_id: req.session.user}, (err, user) => {
			user.comparePassword(_password, (err, isMatch) => {
				if (err) {
					return res.redirect('/admin/user/resetpwd');
				}
				if(isMatch) {
					user.password = _newpwd;
					user.confirmpwd = _confirmpwd;
					user.resetPwd().then(function() {
						res.render('../admin/password', {
							title: '管理',
							message: '修改成功'
						});
					}).catch( (err) => {
						let errorMessage = '';
							switch( err ) {
								case user.PASSWORD_IS_NOT_VALIDATE:
								//console.log('密码格式不正确');
								errorMessage = '密码格式不正确';
								break
								case user.TWO_PASSWORD_IS_NOT_MATCH:
								//console.log('两次输入的密码不一致');
								errorMessage = '两次输入的密码不一致';
								break
								default:
								//console.log('发生了一点意外');
								errorMessage = '发生了一点意外';
								break;
							}
							res.render('../admin/password', {
								title: '管理',
								message: errorMessage
							})
						})
				} else {
					res.render('../admin/password',{
						title: '个人中心',
						message: '密码错误'
					})
				}
			})
		})
	})

	router.delete('deart', (req, res, next) => {
		let id = req.query.id;
	    if(id) {
	    	Article.findById({_id: id}).then((article) => {
	    		User.findById({_id: article.author}, (err, user) => {
	    			if (req.session.user._Id !== user._id && req.session.user.role < 50) {
				    	return res.redirect('back');
				    };
	    			for(let i = 0; i < user.articles.length; i++) {
	    				if (user.articles[i].toString() == article._id) {
	    					user.articles.splice(i,1);
	    					break;
	    				}
	    			}
	    			user.save((err, user) => {
	    				if (err) {
	    					console.log(err);
	    				};
	    			})
	    		})
	    		return article;
	    	}).then((article) => {
	    		console.log('330');
	    		console.log(article);
	    		Tag.findById({_id: article.tag}, (err, tag) => {
	    			for(let i = 0; i < tag.articles.length; i++) {
	    				if (tag.articles[i].toString() == article._id) {
	    					tag.articles.splice(i,1);
	    					break;
	    				}
	    			}
	    			if (!tag.articles.length) {
	    				Tag.remove({_id: tag._id}, (err, tag) => {
	    					if (err) {
	    						console.log(err);
	    					};
	    				})
	    			} else {
	    				tag.save((err, user) => {
		    				if (err) {
		    					console.log(err);
		    				};
		    			})
	    			}
	    		})
	    	}).then(() => {
	    		Article.remove({_id:id}, (err,article) => {
	        	if(err) {
	        		console.log(err);
	        	} else {
	        		res.json({success: 1});
	        	}
	        })
	    	})   
	    }
	})

	module.exports = router;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("underscore");

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	const express = __webpack_require__(6),
				router = express.Router(),
				Article = __webpack_require__(18),
				User = __webpack_require__(20),
				Tag = __webpack_require__(23),
				marked = __webpack_require__(25),
				_ = __webpack_require__(32);


	router.post('/reg', (req, res, next) => {
		let user = new User();
		let _user = req.body.user;
		user.name = _user.name;
		user.password = _user.password;
		user.email = _user.email;
		user.confirmpwd = _user.confirmpwd;
		user.head = "http://7xsn9b.com1.z0.glb.clouddn.com/" + Math.ceil(7 * Math.random()) + ".jpg";
		user.register().then(function() {
			req.session.user = user;
			res.redirect('/');
		}).catch(function(err) {
			let errorMessage = '';
			switch( err ) {
				case user.USERNAME_IS_NOT_VALIDATE:
				//console.log('用户名格式不正确');
				errorMessage = '用户名格式不正确';
				break;

				case user.PASSWORD_IS_NOT_VALIDATE:
				//console.log('密码格式不正确');
				errorMessage = '密码格式不正确';
				break

				case user.TWO_PASSWORD_IS_NOT_MATCH:
				//console.log('两次输入的密码不一致');
				errorMessage = '两次输入的密码不一致';
				break

				case user.EMAIL_IS_NOT_VALIDATE:
				//console.log('邮箱格式不正确');
				errorMessage = '邮箱格式不正确';
				break

				case user.USERNAME_IS_TO_BE_USED:
				//console.log('用户名已经被注册了');
				errorMessage = '用户名已经被注册了';
				break

				case user.EMAIL_IS_TO_BE_USED:
				//console.log('邮箱已经被注册了');
				errorMessage = '邮箱已经被注册了';
				break

				default:
				//console.log('发生了一点意外');
				errorMessage = '发生了一点意外';
				break;
			}
			console.log('wocao+'+errorMessage);
			res.render('register', {
				title: '注册',
				message: errorMessage
			})
		})
	})

	router.post('/login', (req, res, next) => {
		let _user = req.body.user,
				_name = _user.name,
				_password = _user.password;
		User.findOne({name: _name}, (err, user) => {
			if (err) {
				console.log(err);
				return res.redirect('/user/login');
			} 
			if (!user) {
				return res.render('login',{
					title: '登录',
					message: '用户不存在'
				})
			}
			user.comparePassword(_password, (err, isMatch) => {
				if (err) {
					console.log(err);
					return res.redirect('/user/login');
				}
				if(isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					res.render('login',{
						title: '登录',
						message: '密码错误'
					})
				}
			})
		})
	})

	router.get('/logout', (req, res, next) => {
		req.session.user = null;
		res.redirect('/');
	})

	//-----------------------------------------ajax---------------------------------------
	router.get('/checkUserName', (req, res, next) => {
		let username = req.query.username;
		console.log(username);
		console.log(222222);
		let user = new User();
		console.log(user);
		user.name = username;
		if ( !user.verifyUserName() ) {
			res.json({
				errorCode : 1,
				message: '用户名格式不正确'
			});
		}
		user.getUserInfoByUserName(username).then(function(userInfo) {
			if (userInfo) {
				res.json({
					errorCode : 2,
					message: '用户名已经被注册了'
				});
			} else {
				res.json({
					errorCode : 0,
					message: '用户名可以注册'
				});
			}
		}).catch(function(err) {
			res.json({
				errorCode : 3,
				message: err
			});
		})
	})

	router.get('/checkEmail', (req, res, next) => {
		let email = req.query.email;

		let user = new User();
		user.email = email;
		if ( !user.verifyEmail() ) {
			res.json({
				errorCode : 1,
				message: '邮箱格式不正确'
			});
		}
		user.getUserInfoByEmail(email).then(function(userInfo) {
			if (userInfo) {
				res.json({
					errorCode : 2,
					message: '邮箱已经被注册了'
				});
			} else {
				res.json({
					errorCode : 0,
					message: '邮箱可以注册'
				});
			}
		}).catch(function(err) {
			res.json({
				errorCode : 3,
				message: err
			});
		})
	})


	module.exports = router;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	const express = __webpack_require__(6);
	const router = express.Router();
	const Article = __webpack_require__(18);
	const Tag = __webpack_require__(23);
	const User = __webpack_require__(20);
	const marked = __webpack_require__(25);

	let re = /<[^>]*>/g;

	router.get('/index', (req, res, next) => {
		let page = parseInt(req.query.p, 10) || 1,
		len,
		time;
		const count = 6;
		let index = count * page;
		Article
		.find({})
		.sort({'meta.createTime':-1})
		.populate('author')
		.populate('tag')
		.exec((err, articles) => {
			len = articles.length;
			articles = articles.slice(index, index+count);
			articles.forEach((article,index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re,'');
				if (article.text.length > 300) {
					article.text = article.text.substring(0,300);
					article.text = article.text + ' ...';
				}
			})
			res.json({articles:articles,showmore:{page:page,len:len,count:count}});
		})
	})

	router.get('/author', (req, res, next) => {
		let id = req.query.id;
		let page = parseInt(req.query.p, 10) || 1,
		len;
		const count = 6;
		let index = count * page;
		User
			.findById({_id: id})
			.populate('articles')
			.exec((err, user) => {
				if (err) {
					console.log(err);
					return res.redirect('/');
				}
				len = user.articles.length;
				user.articles.sort((a,b)=> {
					return b.meta.createTime-a.meta.createTime;
				})

				articles = user.articles.slice(index,index+count);
				articles.forEach((article,index) => {
					article.text = marked(article.text);
					article.text = article.text.replace(re,'');
					if (article.text.length > 300) {
						article.text = article.text.substring(0,300);
						article.text = article.text + ' ...';
					}
				})
				articles.forEach((article) => {
					article.author.name = user.name;
				})
				res.json({articles:articles, name:user.name, showmore:{page:page,len:len,count:count}});
			})
	})

	router.get('/tag', (req, res, next) => {
		let id = req.query.id,
				page = parseInt(req.query.p, 10) || 1,
		    len;
		const count = 6;
		let index = count * page;
		Tag
		.findById({_id: id})
		.populate('articles')
		.exec((err, tag) => {
			if (err) {
				console.log(err);
			};
			len = tag.articles.length;
			tag.articles = tag.articles.slice(index,index+count);
			res.json({articles:tag.articles,showmore:{page:page,len:len,count:count}});
		})
	})

	router.get('/results', (req, res, next) => {
		let q = req.query.q,
				page = parseInt(req.query.p, 10) || 1,
		    len;
		const count = 6;
		let index = count * page;
		Article.count((err, count) => {
	  	if (err) {
	  		console.log(err);
	  	};
	  	len = count;
	  });
		Article
		.find({title: new RegExp(q + '.*', 'i')})
		.limit(count)
		.skip(index)
		.exec((err, articles) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			articles.forEach((article,index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re,'');
				if (article.text.length > 300) {
					article.text = article.text.substring(0,300);
					article.text = article.text + ' ...';
				}
			})
			res.json({articles:articles,showmore:{page:page,len:len,count:count}});
		})
	})


	module.exports = router;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {
	const express = __webpack_require__(6);
	const managerApp = express();
	const path = __webpack_require__(7);
			

	let manager = (app) => {

		managerApp.set('views', path.join(__dirname, '../app/views/manager'));
		managerApp.set('view engine', 'ejs');

		managerApp.use( (req, res, next) => {
		  let _user = req.session.user;
		  managerApp.locals.user = _user;
		  next();
		})

		managerApp.use( (req, res, next) => {
			let user = req.session.user;
				if (user && user.role > 50) {
					next();
				} else {
					return res.redirect('back');
				}
			
		})

		//路由模块
		const routers = {
			main: __webpack_require__(38)
		};

		managerApp.use( '/', routers.main );


		return managerApp;

	}

	module.exports = manager;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	const express = __webpack_require__(6);
	const router = express.Router();
	const User = __webpack_require__(39);


	router.get('/', (req, res, next) => {
		User
		.find({})
		.exec((err, users) => {
			res.render('config', {
				title: '管理中心',
				users: users
			})
		})
	})



	module.exports = router;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	const mongoose = __webpack_require__(13);
	const UserSchema = __webpack_require__(21);
	/**
	 * [Movie description] 编译生成movie模型
	 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
	 */
	let User = mongoose.model('User', UserSchema);


	User.prototype.matchRegexp = {
		name: /^\w{3,20}$/,
		password: /^.{3,20}$/,
		email: /^\w+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/
	}

	//无效用户名
	User.prototype.USERNAME_IS_NOT_VALIDATE = Symbol();
	//用户名已经注册
	User.prototype.USERNAME_IS_TO_BE_USED = Symbol();
	//无效密码
	User.prototype.PASSWORD_IS_NOT_VALIDATE = Symbol();
	//两次密码不一致
	User.prototype.TWO_PASSWORD_IS_NOT_MATCH = Symbol();
	//无效email
	User.prototype.EMAIL_IS_NOT_VALIDATE = Symbol();
	//邮箱已经注册
	User.prototype.EMAIL_IS_TO_BE_USED = Symbol();

	/**
	 * 用户注册
	 * @return {[type]} [description]
	 */
	User.prototype.register = function() {
		return new Promise( (resolve, reject) => {
			if ( !this.verifyUserName() ) {
				return reject(this.USERNAME_IS_NOT_VALIDATE);
			}
			if ( !this.verifyPassWord() ) {
				return reject(this.PASSWORD_IS_NOT_VALIDATE);
			}
			if ( this.password !== this.confirmpwd) {
				return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
			}
			if ( !this.verifyEmail() ) {
				return reject(this.EMAIL_IS_NOT_VALIDATE);
			}

			resolve();
		}).then( () => {
			return this.getUserInfoByUserName(this.name).then( userInfo => {
				if (userInfo) {
					return Promise.reject( this.USERNAME_IS_TO_BE_USED );
				} else {
					return Promise.resolve();
				}
			});
		}).then( () => {
			return this.getUserInfoByEmail(this.email).then( userInfo => {
				if (userInfo) {
					return Promise.reject(this.EMAIL_IS_TO_BE_USED);
				} else {
					return Promise.resolve();
				}
			} )
		} ).then( () => {
			return this.save();
		} )
	}

	User.prototype.resetPwd = function() {
		return new Promise( (resolve, reject) => {
			if ( !this.verifyPassWord() ) {
				return reject(this.PASSWORD_IS_NOT_VALIDATE);
			}
			if ( this.password !== this.confirmpwd) {
				return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
			}
			resolve();
		}).then( () => {
			return this.save();
		})
	}
	/*
	* 用户登录
	* */
	// User.prototype.login = function() {
	// 	return new Promise( (resolve, reject) => {
	// 		this.type = ['name','email'].indexOf(this.type) != -1 ? this.type : 'name';
	// 		if (this.type == 'name') {
	// 			return this.getUserInfoByUserName(this.account).then( userInfo => {
	// 				if (userInfo) {
	// 					//存在该用户
	// 					console.log(userInfo.password, this.password)
	// 					if (userInfo.password == this.password) {
	// 						return resolve(userInfo);
	// 					} else {
	// 						//密码错误
	// 						return reject();
	// 					}
	// 				} else {
	// 					return reject();
	// 				}
	// 			} )
	// 		} else {
	// 			return this.getUserInfoByEmail(this.account).then( userInfo => {
	// 				if (userInfo) {
	// 					//存在该用户
	// 					if (userInfo.password == this.password) {
	// 						return resolve(userInfo);
	// 					} else {
	// 						//密码错误
	// 						return reject();
	// 					}
	// 				} else {
	// 					return reject();
	// 				}
	// 			} )
	// 		}
	// 	});
	// }

	/**
	 * 验证用户名
	 * @return {[type]} [description]
	 */
	User.prototype.verifyUserName = function() {
		return this.matchRegexp.name.test(this.name);
	}
	/**
	 * 验证密码
	 * @return {[type]} [description]
	 */
	User.prototype.verifyPassWord = function() {
		return this.matchRegexp.password.test(this.password);
	}
	/**
	 * 验证邮箱
	 * @return {[type]} [description]
	 */
	User.prototype.verifyEmail = function() {
		return this.matchRegexp.email.test(this.email);
	}
	/**
	 * 通过用户 USERNAME 获取用户信息
	 * @return {[type]} [description]
	 */
	User.prototype.getUserInfoByUserName = function(name) {
		return User.findOne({
			name: name
		}).exec();
	}
	/**
	 * 通过用户 EMAIL 获取用户信息
	 * @return {[type]} [description]
	 */
	User.prototype.getUserInfoByEmail = function(email) {
		return User.findOne({
			email: email
		}).exec();
	}
	/**
	 * 通过用户 uid 获取用户信息
	 * @return {[type]} [description]
	 */
	User.prototype.getUserInfoById = function(uid) {
		return User.findOne({
			_id: uid
		}).exec();
	}

	module.exports = User;



/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var crypto = __webpack_require__(3)
	var bcrypt = __webpack_require__(22)

	function getRandomString(len) {
	  if (!len) len = 16

	  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
	}

	var should = __webpack_require__(4)
	var app = __webpack_require__(5)
	var Tag = __webpack_require__(23)

	var tag

	// test
	describe('<Unit Test', function() {
	  describe('Model Tag:', function() {
	    before(function(done) {
	      tag = {
	        name: getRandomString()
	      }

	      done()
	    })

	    describe('Before Method save', function() {
	      it('should begin without test tag', function(done) {
	        Tag.find({name: tag.name}, function(err, tags) {
	          tags.should.have.length(0)

	          done()
	        })
	      })
	    })

	    describe('Tag save', function() {
	      it('should save without problems', function(done) {
	        var _tag = new Tag(tag)

	        _tag.save(function(err) {
	          should.not.exist(err)
	          _tag.remove(function(err) {
	            should.not.exist(err)
	            done()
	          })
	        })
	      })

	      it('should fail to save an existing tag', function(done) {
	        var _tag1 = new Tag(tag)

	        _tag1.save(function(err) {
	          should.not.exist(err)

	          var _tag2 = new Tag(tag)

	          _tag2.save(function(err) {
	            should.exist(err)

	            _tag1.remove(function(err) {
	              if (!err) {
	                _tag2.remove(function(err) {
	                  done()
	                })
	              }
	            })
	          })
	        })
	      })
	    })

	    after(function(done) {
	      // clear tag info
	      done()
	    })
	  })
	})

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var crypto = __webpack_require__(3)
	var bcrypt = __webpack_require__(22)

	function getRandomString(len) {
	  if (!len) len = 16

	  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
	}

	var should = __webpack_require__(4)
	var app = __webpack_require__(5)
	var User = __webpack_require__(20)

	var user

	// test
	describe('<Unit Test', function() {
	  describe('Model User:', function() {
	    before(function(done) {
	      user = {
	        name: getRandomString(),
	        password: 'password'
	      }

	      done()
	    })

	    describe('Before Method save', function() {
	      it('should begin without test user', function(done) {
	        User.find({name: user.name}, function(err, users) {
	          users.should.have.length(0)

	          done()
	        })
	      })
	    })

	    describe('User save', function() {
	      it('should save without problems', function(done) {
	        var _user = new User(user)

	        _user.save(function(err) {
	          should.not.exist(err)
	          _user.remove(function(err) {
	            should.not.exist(err)
	            done()
	          })
	        })
	      })

	      it('should password be hashed correctly', function(done) {
	        var password = user.password
	        var _user = new User(user)

	        _user.save(function(err) {
	          should.not.exist(err)
	          _user.password.should.not.have.length(0)

	          bcrypt.compare(password, _user.password, function(err, isMatch) {
	            should.not.exist(err)
	            isMatch.should.equal(true)

	            _user.remove(function(err) {
	              should.not.exist(err)
	              done()
	            })
	          })
	        })
	      })

	      it('should have default role 0', function(done) {
	        var _user = new User(user)

	        _user.save(function(err) {
	          _user.role.should.equal(0)

	          _user.remove(function(err) {
	            done()
	          })
	        })
	      })

	      it('should fail to save an existing user', function(done) {
	        var _user1 = new User(user)

	        _user1.save(function(err) {
	          should.not.exist(err)

	          var _user2 = new User(user)

	          _user2.save(function(err) {
	            should.exist(err)

	            _user1.remove(function(err) {
	              if (!err) {
	                _user2.remove(function(err) {
	                  done()
	                })
	              }
	            })
	          })
	        })
	      })
	    })

	    after(function(done) {
	      // clear user info
	      done()
	    })
	  })
	})

/***/ }
/******/ ]);
//# sourceMappingURL=4ac7cf7dc9c8527ca2dd2f48bc592e15-output.js.map