'use strict';

const express = require('express');
const router = express.Router();
const Article = require('../../models/article');

/**
 * 首页
 */
router.get('/post', (req, res, next) => {
	res.render('post', {
		title: '发表文章',
		article: {}
	})
})


router.get('/author/:id', (req, res, next) => {
	let id = req.params.id;
	if (req.session.user._id !== id && req.session.user.role < 50) {
		return res.redirect('back');
	};
	Article
		.find({
			author: id
		})
		.sort({
			'meta.createTime': -1
		})
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
			.findById({
				_id: id
			})
			.populate('tag')
			.exec((err, article) => {
				if (req.session.user._Id !== article.user && req.session.user.role < 50) {
					return res.redirect('back');
				};
				res.render('post', {
					title: '发表文章',
					article: article
				})
			})
	}
})

module.exports = router;