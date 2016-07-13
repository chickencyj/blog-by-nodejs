require('../css/author_index.css');
let $ = require("jquery");
let textAjax = require('./common/textAjax.js');
module.exports = $(() => {
	let page = {value: 1},
			authorId = window.location.href.slice(window.location.href.lastIndexOf('/')+1);
	$('#author_showmore').click(() => {
		textAjax.getTextMore(page,'#author_showmore','/author/showmore?id='+authorId+'&p=','#author_content');
	})
})