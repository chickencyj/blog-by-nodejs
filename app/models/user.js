const mongoose = require('mongoose');
const UserSchema = require('../schema/user');
/**
 * [Movie description] 编译生成movie模型
 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
 */
let User = mongoose.model('User', UserSchema);


User.prototype.matchRegexp = {
	name: /^\w{3,20}$/,
	password: /^.{3,20}$/,
	email: /^\w+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)+$/
}

//无效用户名
User.prototype.USERNAME_IS_NOT_VALIDATE = Symbol();
//用户名已经注册
User.prototype.USERNAME_IS_TO_BE_USED = Symbol();
//无效密码
User.prototype.PASSWORD_IS_NOT_VALIDATE = Symbol();
//两次密码不一致
User.prototype.TWO_PASSWORD_IS_NOT_MATCH = Symbol();
//无效email
User.prototype.EMAIL_IS_NOT_VALIDATE = Symbol();
//邮箱已经注册
User.prototype.EMAIL_IS_TO_BE_USED = Symbol();

/**
 * 用户注册
 * @return {[type]} [description]
 */
User.prototype.register = function () {
	return new Promise((resolve, reject) => {
		if (!this.verifyUserName()) {
			return reject(this.USERNAME_IS_NOT_VALIDATE);
		}
		if (!this.verifyPassWord()) {
			return reject(this.PASSWORD_IS_NOT_VALIDATE);
		}
		if (this.password !== this.confirmpwd) {
			return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
		}
		if (!this.verifyEmail()) {
			return reject(this.EMAIL_IS_NOT_VALIDATE);
		}

		resolve();
	}).then(() => {
		return this.getUserInfoByUserName(this.name).then(userInfo => {
			if (userInfo) {
				return Promise.reject(this.USERNAME_IS_TO_BE_USED);
			} else {
				return Promise.resolve();
			}
		});
	}).then(() => {
		return this.getUserInfoByEmail(this.email).then(userInfo => {
			if (userInfo) {
				return Promise.reject(this.EMAIL_IS_TO_BE_USED);
			} else {
				return Promise.resolve();
			}
		})
	}).then(() => {
		return this.save();
	})
}

User.prototype.resetPwd = function () {
	return new Promise((resolve, reject) => {
		if (!this.verifyPassWord()) {
			return reject(this.PASSWORD_IS_NOT_VALIDATE);
		}
		if (this.password !== this.confirmpwd) {
			return reject(this.TWO_PASSWORD_IS_NOT_MATCH);
		}
		resolve();
	}).then(() => {
		return this.save();
	})
}
/*
 * 用户登录
 * */
// User.prototype.login = function() {
// 	return new Promise( (resolve, reject) => {
// 		this.type = ['name','email'].indexOf(this.type) != -1 ? this.type : 'name';
// 		if (this.type == 'name') {
// 			return this.getUserInfoByUserName(this.account).then( userInfo => {
// 				if (userInfo) {
// 					//存在该用户
// 					console.log(userInfo.password, this.password)
// 					if (userInfo.password == this.password) {
// 						return resolve(userInfo);
// 					} else {
// 						//密码错误
// 						return reject();
// 					}
// 				} else {
// 					return reject();
// 				}
// 			} )
// 		} else {
// 			return this.getUserInfoByEmail(this.account).then( userInfo => {
// 				if (userInfo) {
// 					//存在该用户
// 					if (userInfo.password == this.password) {
// 						return resolve(userInfo);
// 					} else {
// 						//密码错误
// 						return reject();
// 					}
// 				} else {
// 					return reject();
// 				}
// 			} )
// 		}
// 	});
// }

/**
 * 验证用户名
 * @return {[type]} [description]
 */
User.prototype.verifyUserName = function () {
	return this.matchRegexp.name.test(this.name);
}
/**
 * 验证密码
 * @return {[type]} [description]
 */
User.prototype.verifyPassWord = function () {
	return this.matchRegexp.password.test(this.password);
}
/**
 * 验证邮箱
 * @return {[type]} [description]
 */
User.prototype.verifyEmail = function () {
	return this.matchRegexp.email.test(this.email);
}
/**
 * 通过用户 USERNAME 获取用户信息
 * @return {[type]} [description]
 */
User.prototype.getUserInfoByUserName = function (name) {
	return User.findOne({
		name: name
	}).exec();
}
/**
 * 通过用户 EMAIL 获取用户信息
 * @return {[type]} [description]
 */
User.prototype.getUserInfoByEmail = function (email) {
	return User.findOne({
		email: email
	}).exec();
}
/**
 * 通过用户 uid 获取用户信息
 * @return {[type]} [description]
 */
User.prototype.getUserInfoById = function (uid) {
	return User.findOne({
		_id: uid
	}).exec();
}

module.exports = User;