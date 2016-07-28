const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
//专门为密码存储设计的算法
//先生成一个随机的盐，然后将密码和盐混合进行加密，就拿到了最终存储的密码
const bcrypt = require('bcrypt');
let SALT_WORK_FACTORY = 10;

const UserSchema = new mongoose.Schema({
	//一般网站保护密码最好的密码是加盐密码哈希后的值
	//哈希算法将任意长度的二进制值映射为较短的固定长度的二进制值，这个小的二进制值称为哈希值。
	//过程不可逆（md5）
	name: {
		//唯一
		unique: true,
		type: String
	},
	email: {
		unique: true,
		type: String
	},
	password: String,
	articles: [{type: ObjectId, ref: 'Article'}],
	pv: {
		type: Number,
		default: 0
	},
	head: String,
	poster: String,
	signature: String,
	avator: String,
	//0:normal  1:verified 2:advance
	//>10: admin
	///>50: super admin 
	role: {
		type: Number,
		default: 0
	},
	meta: {
		createTime: {
			type: Date,
			default:Date.now()
		},
		updateTime: {
			type: Date,
			default:Date.now()
		}
	}
})
// //每次存储数据之前都会去调用这个方法
// UserSchema.pre('save', function (next) {
// 	var user = this;
// 	//判断数据是否是新加的
// 	if(this.isNew) {
// 		this.meta.createTime = this.meta.update = Date.now();
// 	} else {
// 		this.meta.updateTime = Date.now()
// 	}
// 	//生成一个随机的盐,接受两个参数，第一个为计算强度，第二个为cb,cb中参数可拿到生成后的salt
// 	bcrypt.genSalt(SALT_WORK_FACTORY, function (err,salt) {
// 		//如果有错误，通过next传入下个流程
// 		if(err) {
// 			return next(err);
// 		}
// 		//hash接受三个参数,第三个参数拿到生成后的hash
// 		bcrypt.hash(user.password, salt, function (err,hash) {
// 			if (err) {
// 				return next(err);
// 			}
// 			console.log("hash:"+hash);
// 			//将hash保存到user.password
// 			user.password = hash;
// 			console.log(this.password+':'+user.password);
// 			//进入下一个流程
// 			next();
// 		})
// 	})	
// 	next();
// })
// //实例方法,实例才可调用
// UserSchema.methods = {
	
//   comparePassword: function(_password, cb) {
//   	var _this = this;
//   	bcrypt.hash(_this.password,SALT_WORK_FACTORY,function(err,hash){
//   		if (err) {
//   			console.log(err);
//   		}
//   		bcrypt.compare(_password, hash, function(err, isMatch) {
// 	      if (err) return cb(err);

// 	      cb(null, isMatch);
//     	})
//   	})
    
//   }
// }

//每次存储数据之前都会去调用这个方法
UserSchema.pre('save', function(next) {
  var user = this
  //判断数据是否是新加的
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  //生成一个随机的盐,接受两个参数，第一个为计算强度，第二个为cb,cb中参数可拿到生成后的salt
  bcrypt.genSalt(SALT_WORK_FACTORY, function(err, salt) {
    if (err) return next(err)
    //hash接受三个参数,第三个参数拿到生成后的hash
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})
//实例方法,实例才可调用
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

// //只有进行模型编译实例化以后才能有这些方法
// UserSchema.statics = {
// 	//用来查找数据库里所有数据
// 	fetch: function(cb) {
// 		return this
// 			.find({})
// 			.sort('meta.updateTime') //按照更新时间排序
// 			.exec(cb) 	//执行回调方法
// 	},
// 	//用来查询单条数据
// 	findById: function(id, cb) {
// 		return this
// 			.findOne({_id:id})
// 			.exec(cb) 	//执行回调方法
// 	}
// }
module.exports = UserSchema;