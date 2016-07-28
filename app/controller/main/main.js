const express = require('express'),
			router = express.Router(),
			Article = require('../../models/article'),
			User = require('../../models/user'),
			Tag = require('../../models/tag'),
			marked = require('marked');

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
				len = article.author.articles.length;
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