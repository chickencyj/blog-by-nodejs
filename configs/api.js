
const express = require('express');
const apiApp = express();
const path = require('path');

let api = (app) => {
	
	apiApp.set('views', path.join(__dirname, '../app/views/main'));
	apiApp.set('view engine', 'ejs');


	apiApp.use( (req, res, next) => {
	  let _user = req.session.user;
	  apiApp.locals.user = _user;
	  next();
	})
	//路由模块
	const routers = {
		main: require('../app/controller/api/main'),
		user: require('../app/controller/api/user'),
		showmore: require('../app/controller/api/showmore')
	};
	//主模块
	apiApp.use( '/', routers.main );
	//用户模块
	apiApp.use('/user', routers.user);

	apiApp.use('/showmore', routers.showmore);

	return apiApp;
}

module.exports = api;