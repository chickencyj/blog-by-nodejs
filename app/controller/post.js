const Article = require('../models/article'),
			User = require('../models/user'),
			Tag = require('../models/tag'),
			marked = require('marked'),
			_ = require('underscore');
			


var re = /<[^>]*>/g;
//发表文章页
exports.publish = (req, res) => {
	res.render('post',{
		title: '发表文章',
		article: {},
		user: req.session.user,
  	success: req.flash('success').toString(),
  	error: req.flash('error').toString()
	})
}

//修改文章页面
exports.edit = (req, res) => {
	var id = req.params.id;
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
					user: req.session.user,
					article: article,
			  	success: req.flash('success').toString(),
			  	error: req.flash('error').toString()
				})
			})
	}
}

//发表逻辑
exports.post = (req, res) => {
	var articleObj = req.body.article,
			_title = articleObj.title,
			_text = articleObj.text,
			_tag = articleObj.tag,
			_id = articleObj._id,
			currentUser = req.session.user,
			_article;
	console.log("_id:"+_id);
	//文章存在即修改文章
	if (_id) {
		//标签名唯一，所以用名字查找
		Tag.findOne({name: _tag}, (err, tag) => {
			//已经有标签
			if (tag) {
				Article.findById({_id: _id}).then((article) => {
					if (err) {
						req.flash('error', err);
						return res.redirect('/post');
					}
						//判断更新的标签名是否与文章原本标签一致
					if (article.tag.toString() == tag._id) {
						articleObj.tag = article.tag;
					} else {
						//不相同则修改文章tag对象并且在Tag中修改
						articleObj.tag = tag._id;
						Tag.findOne({_id: article.tag}).then((tag) => {
							//tag不存在则删除旧的tag中这篇文章id
							for(var i = 0; i < tag.articles.length; i++ ) {
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
										req.flash('error', err);
										return res.redirect('/post');
									}
								})
							}		
						}).then(() => {
							Tag.findById({_id: tag._id}).then((tag) => {
								tag.articles.push(article._id);
								tag.save((err, _tag) => {
									if (err) {
										req.flash('error', err);
										return res.redirect('/post');
									}
								})
							})
						})
					}
					//underscore里extend方法，另外一个对象新的字段替换掉老的对象的字段
					_article = _.extend(article, articleObj);
					_article.save((err, article) => {
						if (err) {
							req.flash('error', err);
							return res.redirect('/post');
						}
						res.redirect('/post/' + article._id);
					})
				}) 
			} else {
					console.log('123');
					var tagname = _tag;
					//找到文章
					Article.findById({_id: _id}).then((article) => {
						//找到标签并移除里面存储的文章
						Tag.findOne({_id: article.tag}).then((tag) => {
							console.log('134');
							//tag不存在则删除旧的tag中这篇文章id
							for(var i = 0; i < tag.articles.length; i++ ) {
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
									console.log('191');

								})
							} else {
								tag.save((err, _tag) => {
									if (err) {
										req.flash('error', err);
										return res.redirect('/post');
									}
									console.log('148');
								})
							}
						}).then(() => {
							Article.findById({_id: _id}).then((article) => {
								console.log('153');
								if (err) {
									req.flash('error', err);
									return res.redirect('/post');
								}						
								//创建新tag，保存文章id			
								var _tag = new Tag({name: tagname});
								_tag.articles.push(_id);
								articleObj.tag = _tag._id;
								//underscore里extend方法，另外一个对象新的字段替换掉老的对象的字段
								_article = _.extend(article, articleObj);		
								_tag.save((err, _tag) => {
									if (err) {
										console.log('122');
										req.flash('error', err);
										return res.redirect('/post');
									}
									console.log('174');
									_article.save((err, article) => {
										if (err) {
											console.log('177');
											req.flash('error', err);
											return res.redirect('/post');
										}
										return res.redirect('/post/' + article._id);
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
		var tagname = _tag;
		Tag.findOne({name: _tag}, (err, tag) => {
			console.log('201');
			if (err) {
				console.log(err);
			};
			if (!tag) {
				var _tag = new Tag({name: tagname});
				var	_article = new Article({author:currentUser, title:_title, text:_text, tag:_tag._id});
				_tag.articles.push(_article._id);
				_tag.save((err, tag) => {
					if (err) {
						console.log(err);
						req.flash('error', err);
						return res.redirect('/post');
					}
					//存储article
					_article.save((err, article) => {
						if (err) {
							console.log(err);
							req.flash('error', err);
							return res.redirect('/post');
						}
						//找到当前用户并在其实例中的articles属性中添加发表的文章id并存储
						User.findById(currentUser, (err, user) => {
							if (err) {
								console.log(err);
								req.flash('error', err);
								return res.redirect('/post');
							}
							user.articles.push(article._id);
							user.save((err, user) => {
								if (err) {
									console.log(err);
									req.flash('error', err);
									return res.redirect('/post');
								}
								res.redirect('/post/' + article._id);
							})
						})
					})
				})
			} else {
				var	_article = new Article({author:currentUser, title:_title, text:_text, tag:tag._id});
				tag.articles.push(_article._id);
				tag.save((err, tag) => {
					if (err) {
						req.flash('error', err);
						return res.redirect('/post');
					}
				//存储article
					_article.save((err, article) => {
						if (err) {
							req.flash('error', err);
							return res.redirect('/post');
						}
				
						//找到当前用户并在其实例中的articles属性中添加发表的文章id并存储
						User.findById(currentUser, (err, user) => {
							if (err) {
								req.flash('error', err);
								return res.redirect('/post');
							}
							user.articles.push(article._id);
							user.save((err, user) => {
								if (err) {
									req.flash('error', err);
									return res.redirect('/post');
								}
								res.redirect('/post/' + article._id);
							})
						})
					})
				})
			}
		})		
	}	
}

//文章详情
exports.article = (req, res) => {
	var id = req.params.id,
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
				User.update({_id: article.author._id}, {$inc: {pv: 1}}, function (err) {
				if (err) {
						console.log(err);  
					}
				})
				if (err) {
					req.flash('error', err);
					return res.redirect('/');
				}
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
				res.render('article', {
					title: article.title,
					article: article,
					articles: articles,
					preArticle: preArticle,
					nextArticle: nextArticle,
					tags: tags,
					len: len,
					user: req.session.user,
					success: req.flash('success').toString(),
		      error: req.flash('error').toString()
				})
			})
		})
	})
}

//文章删除
exports.delete =  (req, res) => {
    var id = req.query.id;
    if(id) {
    	Article.findById({_id: id}).then((article) => {
    		User.findById({_id: article.author}, (err, user) => {
    			if (req.session.user._Id !== user._id && req.session.user.role < 50) {
			    	return res.redirect('back');
			    };
    			for(var i = 0; i < user.articles.length; i++) {
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
    			for(var i = 0; i < tag.articles.length; i++) {
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
  }


//加载更多
exports.showmore =  (req,res) => {
	console.log(11111);
    var page = parseInt(req.query.p, 10) || 1,
    		len,
    		time;
    const count = 6;
    var index = count * page;
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
		
};


//标签类文章
exports.tag = (req, res) => {
	var id = req.params.id,
			page = parseInt(req.query.p, 10) || 0,
	    len;
	const count = 6;
	var index = count * page;
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
				tag: tag,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			})
		})
	})
}


//标签类文章加载更多
exports.showmoreTag = (req, res) => {
	var id = req.query.id,
			page = parseInt(req.query.p, 10) || 1,
	    len;
	const count = 6;
	var index = count * page;
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
}


//搜索结果页
exports.search = (req, res) => {
	var q = req.query.q,
			page = parseInt(req.query.p, 10) || 0,
	    len;
	const count = 6;
	var index = count * page;
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
					req.flash('error', err);
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
					articles: articles,
					user: req.session.user,
					success: req.flash('success').toString(),
					error: req.flash('error').toString()
				})
			})
		})
}

//搜索结果加载更多
exports.moreResults = (req,res) => {
	var q = req.query.q,
			page = parseInt(req.query.p, 10) || 1,
	    len;
	const count = 6;
	var index = count * page;
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
				req.flash('error', err);
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
		
};


