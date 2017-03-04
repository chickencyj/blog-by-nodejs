const express = require('express');
const router = express.Router();
const User = require('../../models/user');


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