const express = require('express'),
	router = express.Router(),
	Article = require('../../models/article'),
	User = require('../../models/user'),
	Tag = require('../../models/tag'),
	marked = require('marked'),
	_ = require('underscore'),
	multer = require('multer'),
	fs = require('fs'),
	Path = require('path');


let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/upload')
	},
	filename: function (req, file, cb) {
		let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
		cb(null, Date.now() + ext);
	}
})

let upload = multer({
	storage: storage
});
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
		Tag.findOne({
			name: _tag
		}, (err, tag) => {
			//已经有标签
			if (tag) {
				Article.findById({
					_id: _id
				}).then((article) => {
					//判断更新的标签名是否与文章原本标签一致
					if (article.tag.toString() == tag._id) {
						articleObj.tag = article.tag;
					} else {
						//不相同则修改文章tag对象并且在Tag中修改
						articleObj.tag = tag._id;
						Tag.findOne({
							_id: article.tag
						}).then((tag) => {
							//tag不存在则删除旧的tag中这篇文章id
							for (let i = 0; i < tag.articles.length; i++) {
								if (tag.articles[i].toString() == article._id) {
									tag.articles.splice(i, 1);
									break;
								}
							}
							if (!tag.articles.length) {
								Tag.remove({
									_id: tag._id
								}, (err, tag) => {
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
							Tag.findById({
								_id: tag._id
							}).then((tag) => {
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
				Article.findById({
					_id: _id
				}).then((article) => {
					//找到标签并移除里面存储的文章
					Tag.findOne({
						_id: article.tag
					}).then((tag) => {
						//tag不存在则删除旧的tag中这篇文章id
						for (let i = 0; i < tag.articles.length; i++) {
							if (tag.articles[i].toString() == article._id) {
								tag.articles.splice(i, 1);
								break;
							}
						}
						if (!tag.articles.length) {
							Tag.remove({
								_id: article.tag
							}, (err, tag) => {
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
						Article.findById({
							_id: _id
						}).then((article) => {
							if (err) {
								console.log(err);
								return res.redirect('/admin/article/post');
							}
							//创建新tag，保存文章id			
							let _tag = new Tag({
								name: tagname
							});
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
								})
							})
						})
					})
				})
			}
		})
	} else {
		//在查找里面_tag会被改变因此要在这边赋值？？？？？
		let tagname = _tag;
		Tag.findOne({
			name: _tag
		}, (err, tag) => {
			if (err) {
				console.log(err);
			};
			if (!tag) {
				let _tag = new Tag({
					name: tagname
				});
				let _article = new Article({
					author: currentUser,
					title: _title,
					text: _text,
					tag: _tag._id
				});
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
				let _article = new Article({
					author: currentUser,
					title: _title,
					text: _text,
					tag: tag._id
				});
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
		.findOne({
			_id: req.session.user
		})
		.exec((err, user) => {
			user.name = _name;
			if (_signature) {
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
			.findOne({
				_id: req.session.user
			})
			.exec((err, user) => {
				if (user.avator) {
					let preavator = user.avator;
					fs.unlinkSync(Path.join(__dirname, '../../../public/upload/' + preavator));
				}
				user.avator = req.file.filename;
				user.save((err, user) => {
					if (err) {
						console.log(err);
					}
					req.session.user = user;
					let path = req.file.path.substring(req.file.path.indexOf('/'))
					res.json({
						errorCode: 0,
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
	User.findOne({
		_id: req.session.user
	}, (err, user) => {
		user.comparePassword(_password, (err, isMatch) => {
			if (err) {
				return res.redirect('/admin/user/resetpwd');
			}
			if (isMatch) {
				user.password = _newpwd;
				user.confirmpwd = _confirmpwd;
				user.resetPwd().then(function () {
					res.render('../admin/password', {
						title: '管理',
						message: '修改成功'
					});
				}).catch((err) => {
					let errorMessage = '';
					switch (err) {
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
				res.render('../admin/password', {
					title: '个人中心',
					message: '密码错误'
				})
			}
		})
	})
})

router.delete('/deart', (req, res, next) => {
	let id = req.query.id;
	if (id) {
		Article.findById({
			_id: id
		}).then((article) => {
			User.findById({
				_id: article.author
			}, (err, user) => {
				if (req.session.user._Id !== user._id && req.session.user.role < 50) {
					return res.redirect('back');
				};
				for (let i = 0; i < user.articles.length; i++) {
					if (user.articles[i].toString() == article._id) {
						user.articles.splice(i, 1);
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
			Tag.findById({
				_id: article.tag
			}, (err, tag) => {
				for (let i = 0; i < tag.articles.length; i++) {
					if (tag.articles[i].toString() == article._id) {
						tag.articles.splice(i, 1);
						break;
					}
				}
				if (!tag.articles.length) {
					Tag.remove({
						_id: tag._id
					}, (err, tag) => {
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
			Article.remove({
				_id: id
			}, (err, article) => {
				if (err) {
					console.log(err);
				} else {
					res.json({
						success: 1
					});
				}
			})
		})
	}
})

module.exports = router;