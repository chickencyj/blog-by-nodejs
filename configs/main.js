const express = require('express');
const mainApp = express();
const path = require('path');
mainApp.locals.moment = require('moment');

let main = (app) => {

	mainApp.set('views', path.join(__dirname, '../app/views/main'));
	mainApp.set('view engine', 'ejs');

	mainApp.locals.env = process.env.NODE_ENV || 'dev';
	mainApp.locals.reload = true;
	mainApp.use((req, res, next) => {
		let _user = req.session.user;
		mainApp.locals.user = _user;
		next();
	})


	//路由模块
	const routers = {
		main: require('../app/controller/main/main'),
		user: require('../app/controller/main/user')
	};

	//主模块
	mainApp.use('/', routers.main);
	//用户模块
	mainApp.use('/user', routers.user);

	return mainApp;
}

module.exports = main;