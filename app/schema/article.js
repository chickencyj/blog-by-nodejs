const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new mongoose.Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},
	title: String,
	text: String,
	tag: {
		type: ObjectId,
		ref: 'Tag'
	},
	pv: {
		type: Number,
		default: 0
	},
	meta: {
		createTime: {
			type: Date,
			default: Date.now()
		},
		updateTime: {
			type: Date,
			default: Date.now()
		}
	}
})
ArticleSchema.pre('save', function (next) {
	//判断数据是否是新加的
	if (this.isNew) {
		this.meta.createTime = this.meta.update = Date.now();
	} else {
		this.meta, updateTime = Date.now()
	}

	next();
})

ArticleSchema.statics = {
	//用来查找数据库里所有数据
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.updateTime') //按照更新时间排序
			.exec(cb) //执行回调方法
	}
	// //用来查询单条数据
	// findById: function(id, cb) {
	// 	return this
	// 		.findOne({_id:id})
	// 		.exec(cb) 	//执行回调方法
	// }
}

module.exports = ArticleSchema;