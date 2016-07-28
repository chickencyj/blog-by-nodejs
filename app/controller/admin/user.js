
const User = require('../../models/user');
const express = require('express');
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