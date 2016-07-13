const Article = require('../models/article'),
			User = require('../models/user'),
			marked = require('marked');


let re = /<[^>]*>/g;
//个人文章展示页
exports.index = (req, res) => {
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
				req.flash('error', err);
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
				User: user,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			})
		})
}
//个人文章列表页
exports.articles = (req, res) => {
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
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('articlelist', {
				title: '文章列表',
				articles: articles,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			})
		})
}


//
//加载更多
exports.showmore =  (req,res) => {
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
				req.flash('error', err);
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
		
};