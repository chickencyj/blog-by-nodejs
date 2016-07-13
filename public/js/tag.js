require('../css/result_tag.css');
let $ = require("jquery");
let imgAjax = require('./common/imgAjax');
$(() => {
	let flag = {value: true},
			page = 1,
			tagId = window.location.href.slice(window.location.href.lastIndexOf('/')+1);
	$(window).on('scroll', function()  {
	
    //如果最后一个li到可视区的top值小于可视区的高度，表示这个li进入了可视区
    if ($('.blog_tag_content figure:last').get(0).getBoundingClientRect().top <= $(window).innerHeight() && flag.value) {
    	flag.value = false;
	    imgAjax.getImgMore(flag, page, '/api/post/tag/showmore?id='+tagId+'&p=', '.blog_tag_content .row');
	    page++;
	  }
	})
})
