let $ = require("jquery");
$(() => {
	$('#back_top').on('click', () => {
		console.log(123123123);
		$('.navself').removeClass('is_visible');
	})
})