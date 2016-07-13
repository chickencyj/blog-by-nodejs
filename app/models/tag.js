const mongoose = require('mongoose');
const TagSchema = require('../schema/tag');
/**
 * [Movie description] 编译生成movie模型
 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
 */
const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;