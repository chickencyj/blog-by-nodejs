const User = require('../models/user'),
			multer  = require('multer'),
			fs = require('fs'),
			Path = require('path');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        let ext = file.originalname.substring( file.originalname.lastIndexOf('.') );
        cb(null, Date.now() + ext);
    }
})

let upload = multer({ storage: storage });
upload = upload.single('f');
//登录页面
exports.login = (req, res) => {
	res.render('login', {
		title: '登录',
		message: false,
		user: req.session.user
	})
}
//登录逻辑
exports.signIn = (req, res) => {
	let _user = req.body.user,
			_name = _user.name,
			_password = _user.password;
	User.findOne({name: _name}, (err, user) => {
		if (err) {
			req.flash('error', err);
			return res.redirect('/login');
		} 
		if (!user) {
			return res.render('login',{
				title: '登录',
				message: '用户不存在',
				user: req.session.user
			})
		}
		user.comparePassword(_password, (err, isMatch) => {
			if (err) {
				req.flash('error', err);
				return res.redirect('/login');
			}
			if(isMatch) {
				req.session.user = user;
				return res.redirect('/');
			} else {
				res.render('login',{
					title: '登录',
					message: '密码错误',
					user: req.session.user
				})
			}
		})
	})
}

//注册页面
exports.register = (req, res) => {
	res.render('register',{
		title: '注册',
		message: false,
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString() 
	})
}
//注册逻辑
exports.signUp = (req, res) => {
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
			user: req.session.user,
			message: errorMessage
		})
	})

	// User.findOne({"$or": [{name: _name}, {email: _email}]}, (err, user) => {
	// 	if (err) {
	// 		req.flash('error', err);
	// 		return res.redirect('/reg');
	// 	}
	// 	if (user) {
	// 		if (user.name === _name ) {
	// 			req.flash('error', '用户名已经存在!');
	// 			return res.redirect('/reg');
	// 		}
	// 		if(user.email === _email) {
	// 			req.flash('error', '此邮箱已经被注册!');
	// 			return res.redirect('/reg');
	// 		}
			
	// 	}  else if (_password !== _comfirmpwd) {
	// 		req.flash('error', '确认密码输入不相同,请重新输入');
	// 		return res.redirect('/reg');
	// 	} else {
	// 		let user = new User(_user);
	// 		user.save((err, user) => {
	// 			if(err) {
	// 				req.flash('error', err);
	// 				return res.redirect('/reg');
	// 			}
	// 			req.session.user = user;
	// 			res.redirect('/');
	// 		})
	// 	}
	// })
}


//登出逻辑
exports.logout = (req, res) => {
	req.session.user = null;
	res.redirect('/');
}


//用户设置界面
exports.setprofile = (req, res) => {
	User
	.findOne({_id: req.session.user})
	.exec((err, user) => {
		res.render('setprofile', {
			title: '管理',
			User: user,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	})
}

exports.setavator = (req, res) => {
	User
	.findOne({_id: req.session.user})
	.exec((err, user) => {
		res.render('setavator', {
			title: '管理',
			User: user,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		})
	})
}

exports.signature = (req, res) => {
	let _user = req.body.user,
			_name = _user.name,
			_signature = _user.signature;
	User
	.findOne({_id: req.session.user})
	.exec((err, user) => {
		user.name = _name;
		if(_signature) {
			user.signature = _signature;
		}
		user.save((err, user) => {
			if (err) {
				console.log(err);
			}
			req.session.user = user;
			res.redirect('/user/setprofile');
		})
	})
}

exports.avator = (req, res) => {
	upload(req, res, (err) => {
		User
		.findOne({_id: req.session.user}) 
		.exec((err, user) => {
			if (user.avator) {
				let preavator = user.avator;
				fs.unlinkSync(Path.join(__dirname, '../../public/images/'+preavator));
			}
			user.avator = req.file.filename;
			user.save((err, user) => {
				if (err) {
					console.log(err);
				}
				req.session.user = user;
				let path = req.file.path.substring(req.file.path.indexOf('/'))
				res.json({
	        errorCode : 0,
	        message: '上传成功',
	        path: path
	    	})
			})
		})
	})
}

exports.resetpwd = (req, res) => {
	User
	.findOne({_id: req.session.user})
	.exec((err, user) => {
		res.render('password', {
			title: '管理',
			User: user,
			user: req.session.user,
			message:false
		})
	})
}

exports.pwd = (req, res) => {
	let _user = req.body.user,
			_password = _user.password,
			_newpwd = _user.newpwd,
			_confirmpwd = _user.confirmpwd;
	User.findOne({_id: req.session.user}, (err, user) => {
		user.comparePassword(_password, (err, isMatch) => {
			if (err) {
				return res.redirect('/user/resetpwd');
			}
			if(isMatch) {
				user.password = _newpwd;
				user.confirmpwd = _confirmpwd;
				user.resetPwd().then(function() {
					res.render('password', {
						title: '管理',
						user: req.session.user,
						message: '修改成功'
					});
				}).catch( (err) => {
					let errorMessage = '';
						switch( err ) {
							case user.PASSWORD_IS_NOT_VALIDATE:
							//console.log('密码格式不正确');
							errorMessage = '密码格式不正确';
							break
							case user.TWO_PASSWORD_IS_NOT_MATCH:
							//console.log('两次输入的密码不一致');
							errorMessage = '两次输入的密码不一致';
							break
							default:
							//console.log('发生了一点意外');
							errorMessage = '发生了一点意外';
							break;
						}
						res.render('password', {
							title: '管理',
							user: req.session.user,
							message: errorMessage
						})
					})
			} else {
				res.render('password',{
					title: '个人中心',
					message: '密码错误',
					user: req.session.user
				})
			}
		})
	})
}



exports.config = (req, res) => {
	User
	.find({})
	.exec((err, users) => {
		res.render('config', {
			title: '管理中心',
			users: users,
			user: req.session.user
		})
	})
}

//api
exports.checkUserName = (req, res) => {
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
}

exports.checkEmail = (req, res) => {
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
}

//---------------权限控制中间件----------------------------
//未登录(不能做的)
exports.signInRequired = (req, res, next) => {
  let user = req.session.user;
  if (!user) {
    return res.redirect('/login')
  }
  next();
}

//已经登录(不能做的)
exports.signUpRequired = (req, res, next) => {
	if(req.session.user) {
		return res.redirect('back');
	}
	next();
}
//超管
exports.AdminRequired = (req, res, next) => {

	User
	.findById({_id:req.session.user._id})
	.exec((err, user) => {
		if (user.role < 50) {
			console.log(55555);
			return res.redirect('back');
		};
	})
	next();
}
