require('../css/result_tag.css');
if(module.hot) {
    module.hot.accept();
}
let $ = require("jquery");
let imgAjax = require('./common/imgAjax');
$(() => {
	let flag = {value: true},
			page = 1,
			q = window.location.href.split('?')[1].split('=')[1];
	$(window).on('scroll', () =>  {
    if ( $('.blog_result_content figure:last').get(0).getBoundingClientRect().top <= $(window).innerHeight()&& flag.value ) {
    	flag.value = false;
	    imgAjax.getImgMore(flag, page, '/api/showmore/results?q='+q+'&p=', '.blog_result_content .row');
	    page++;
	  }
	})
})
