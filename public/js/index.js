require('../css/author_index.css');
let $ = require("jquery");
let textAjax = require('./common/textAjax.js');
module.exports = $(() => {
	let page = {value: 1};
	$('#index_showmore').click(() => {
		textAjax.getTextMore(page,'#index_showmore','/post/showmore?p=','#index_content');
	})
})
