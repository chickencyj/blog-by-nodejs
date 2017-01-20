// if (process.env.NODE_ENV !== 'production') {
//   require('../../app/views/main/index.ejs')
// }

require('../css/author_index.css');
let $ = require("jquery");
let textAjax = require('./common/textAjax.js');
module.exports = $(() => {
	let page = {
		value: 1
	};
	$('#index_showmore').click(() => {
		textAjax.getTextMore(page, '#index_showmore', '/api/showmore/index?p=', '#index_content');
	})
})