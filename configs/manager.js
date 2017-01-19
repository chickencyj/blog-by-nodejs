const express = require('express');
const managerApp = express();
const path = require('path');

let manager = (app) => {

	managerApp.set('views', path.join(__dirname, '../app/views/manager'));
	managerApp.set('view engine', 'ejs');

	app.locals.env = process.env.NODE_ENV || 'dev';
	app.locals.reload = true;
	managerApp.use((req, res, next) => {
		let _user = req.session.user;
		managerApp.locals.user = _user;
		next();
	})

	managerApp.use((req, res, next) => {
		let user = req.session.user;
		if (user && user.role > 50) {
			next();
		} else {
			return res.redirect('back');
		}

	})

	//路由模块
	const routers = {
		main: require('../app/controller/manager/main')
	};

	managerApp.use('/', routers.main);


	return managerApp;

}

module.exports = manager;