const express = require('express');
const adminApp = express();
const path = require('path');
adminApp.locals.moment = require('moment');

let admin = (app) => {

	adminApp.set('views', path.join(__dirname, '../app/views/admin'));
	adminApp.set('view engine', 'ejs');

	adminApp.use( (req, res, next) => {
	  let _user = req.session.user;
	  adminApp.locals.user = _user;
	  next();
	})
	
	adminApp.use( (req, res, next) => {
		let user = req.session.user;
		if (!user) {
			return res.redirect('/user/login')
		}
		next();
	} )

	//路由模块
	const routers = {
		article: require('../app/controller/admin/article'),
		user: require('../app/controller/admin/user')
	};

	adminApp.use( '/article', routers.article );
	adminApp.use( '/user', routers.user);


	return adminApp;

}

module.exports = admin;