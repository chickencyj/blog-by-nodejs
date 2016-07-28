const express = require('express'),
			router = express.Router(),
			Article = require('../../models/article'),
			User = require('../../models/user'),
			Tag = require('../../models/tag'),
			marked = require('marked'),
			_ = require('underscore');


router.post('/reg', (req, res, next) => {
	let user = new User();
	let _user = req.body.user;
	user.name = _user.name;
	user.password = _user.password;
	user.email = _user.email;
	user.confirmpwd = _user.confirmpwd;
	user.head = "http://7xsn9b.com1.z0.glb.clouddn.com/" + Math.ceil(7 * Math.random()) + ".jpg";
	user.register().then(function() {
		req.session.user = user;
		res.redirect('/');
	}).catch(function(err) {
		let errorMessage = '';
		switch( err ) {
			case user.USERNAME_IS_NOT_VALIDATE:
			//console.log('用户名格式不正确');
			errorMessage = '用户名格式不正确';
			break;

			case user.PASSWORD_IS_NOT_VALIDATE:
			//console.log('密码格式不正确');
			errorMessage = '密码格式不正确';
			break

			case user.TWO_PASSWORD_IS_NOT_MATCH:
			//console.log('两次输入的密码不一致');
			errorMessage = '两次输入的密码不一致';
			break

			case user.EMAIL_IS_NOT_VALIDATE:
			//console.log('邮箱格式不正确');
			errorMessage = '邮箱格式不正确';
			break

			case user.USERNAME_IS_TO_BE_USED:
			//console.log('用户名已经被注册了');
			errorMessage = '用户名已经被注册了';
			break

			case user.EMAIL_IS_TO_BE_USED:
			//console.log('邮箱已经被注册了');
			errorMessage = '邮箱已经被注册了';
			break

			default:
			//console.log('发生了一点意外');
			errorMessage = '发生了一点意外';
			break;
		}
		console.log('wocao+'+errorMessage);
		res.render('register', {
			title: '注册',
			message: errorMessage
		})
	})
})

router.post('/login', (req, res, next) => {
	let _user = req.body.user,
			_name = _user.name,
			_password = _user.password;
	User.findOne({name: _name}, (err, user) => {
		if (err) {
			console.log(err);
			return res.redirect('/user/login');
		} 
		if (!user) {
			return res.render('login',{
				title: '登录',
				message: '用户不存在'
			})
		}
		user.comparePassword(_password, (err, isMatch) => {
			if (err) {
				console.log(err);
				return res.redirect('/user/login');
			}
			if(isMatch) {
				req.session.user = user;
				return res.redirect('/');
			} else {
				res.render('login',{
					title: '登录',
					message: '密码错误'
				})
			}
		})
	})
})

router.get('/logout', (req, res, next) => {
	req.session.user = null;
	res.redirect('/');
})

//-----------------------------------------ajax---------------------------------------
router.get('/checkUserName', (req, res, next) => {
	let username = req.query.username;
	console.log(username);
	console.log(222222);
	let user = new User();
	console.log(user);
	user.name = username;
	if ( !user.verifyUserName() ) {
		res.json({
			errorCode : 1,
			message: '用户名格式不正确'
		});
	}
	user.getUserInfoByUserName(username).then(function(userInfo) {
		if (userInfo) {
			res.json({
				errorCode : 2,
				message: '用户名已经被注册了'
			});
		} else {
			res.json({
				errorCode : 0,
				message: '用户名可以注册'
			});
		}
	}).catch(function(err) {
		res.json({
			errorCode : 3,
			message: err
		});
	})
})

router.get('/checkEmail', (req, res, next) => {
	let email = req.query.email;

	let user = new User();
	user.email = email;
	if ( !user.verifyEmail() ) {
		res.json({
			errorCode : 1,
			message: '邮箱格式不正确'
		});
	}
	user.getUserInfoByEmail(email).then(function(userInfo) {
		if (userInfo) {
			res.json({
				errorCode : 2,
				message: '邮箱已经被注册了'
			});
		} else {
			res.json({
				errorCode : 0,
				message: '邮箱可以注册'
			});
		}
	}).catch(function(err) {
		res.json({
			errorCode : 3,
			message: err
		});
	})
})


module.exports = router;