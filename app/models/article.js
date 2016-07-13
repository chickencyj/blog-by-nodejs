const mongoose = require('mongoose');
const ArticleSchema = require('../schema/article');
/**
 * [Movie description] 编译生成movie模型
 * @type {[type]} 第一个参数为这个模型的名字，第二个参数为模型骨架
 */
const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;