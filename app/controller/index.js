const Article = require('../models/article'),
			User = require('../models/user'),
			marked = require('marked');

let re = /<[^>]*>/g;
/* GET home page. */
exports.index = (req, res, next) => {
	let page = 0,
			len,
			title;
  const count = 6;
  let index = count * page;
  Article.count((err, count) => {
  	console.log(111);
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
				user: req.session.user,
				articles: articles,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		})
}

