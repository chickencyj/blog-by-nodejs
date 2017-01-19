const express = require('express');
const router = express.Router();
const Article = require('../../models/article');
const Tag = require('../../models/tag');
const User = require('../../models/user');
const marked = require('marked');

let re = /<[^>]*>/g;

router.get('/index', (req, res, next) => {
	let page = parseInt(req.query.p, 10) || 1,
		len,
		time;
	const count = 6;
	let index = count * page;
	Article
		.find({})
		.sort({
			'meta.createTime': -1
		})
		.populate('author')
		.populate('tag')
		.exec((err, articles) => {
			len = articles.length;
			articles = articles.slice(index, index + count);
			articles.forEach((article, index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re, '');
				if (article.text.length > 300) {
					article.text = article.text.substring(0, 300);
					article.text = article.text + ' ...';
				}
			})
			res.json({
				articles: articles,
				showmore: {
					page: page,
					len: len,
					count: count
				}
			});
		})
})

router.get('/author', (req, res, next) => {
	let id = req.query.id;
	let page = parseInt(req.query.p, 10) || 1,
		len;
	const count = 6;
	let index = count * page;
	User
		.findById({
			_id: id
		})
		.populate('articles')
		.exec((err, user) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			len = user.articles.length;
			user.articles.sort((a, b) => {
				return b.meta.createTime - a.meta.createTime;
			})

			articles = user.articles.slice(index, index + count);
			articles.forEach((article, index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re, '');
				if (article.text.length > 300) {
					article.text = article.text.substring(0, 300);
					article.text = article.text + ' ...';
				}
			})
			articles.forEach((article) => {
				article.author.name = user.name;
			})
			res.json({
				articles: articles,
				name: user.name,
				showmore: {
					page: page,
					len: len,
					count: count
				}
			});
		})
})

router.get('/tag', (req, res, next) => {
	let id = req.query.id,
		page = parseInt(req.query.p, 10) || 1,
		len;
	const count = 6;
	let index = count * page;
	Tag
		.findById({
			_id: id
		})
		.populate('articles')
		.exec((err, tag) => {
			if (err) {
				console.log(err);
			};
			len = tag.articles.length;
			tag.articles = tag.articles.slice(index, index + count);
			res.json({
				articles: tag.articles,
				showmore: {
					page: page,
					len: len,
					count: count
				}
			});
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
		.find({
			title: new RegExp(q + '.*', 'i')
		})
		.limit(count)
		.skip(index)
		.exec((err, articles) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			articles.forEach((article, index) => {
				article.text = marked(article.text);
				article.text = article.text.replace(re, '');
				if (article.text.length > 300) {
					article.text = article.text.substring(0, 300);
					article.text = article.text + ' ...';
				}
			})
			res.json({
				articles: articles,
				showmore: {
					page: page,
					len: len,
					count: count
				}
			});
		})
})


module.exports = router;