const express = require('express'),
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