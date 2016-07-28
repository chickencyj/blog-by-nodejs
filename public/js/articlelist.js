require('../css/article.css');
let $ = require("jquery");
$(() => {
	$('.del').click((e) => {
		var target = $(e.target);
		var	id = target.data('id');
		var	tr = $('.article-id-' + id);
		$.ajax({
			type: 'DELETE',
			url: '/api/deart?id=' + id
		})
		.done( (results) => {
			if (results.success === 1) {
				console.log(tr);
				if(tr.length > 0) {
					console.log(tr);
					tr.remove();
					console.log(tr);
				}
			};
		})   
	})
})