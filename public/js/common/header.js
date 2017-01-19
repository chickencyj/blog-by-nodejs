let $ = require("jquery");
require('../../css/common/reset.min.css');
require('../../css/common/header.css');
$(() => {
	let overTimer = null,
		outTimer = null;
	$('.header_icon').on('mouseover', () => {
		$('.header_icon_active').css('display', 'block');
		clearTimeout(outTimer);
		overTimer = setTimeout(() => {
			$('.menu_profile').css('display', 'block');
			$('.header_icon').css({
				'left': '-10px',
				'top': '5px',
				'width': '65px',
				'height': '65px'
			});
			$('.header_icon_active').show();
		}, 200)
	})
	$('.menu_profile').on('mouseover', () => {
		clearTimeout(outTimer);
		$('.menu_profile').css('display', 'block');
		$('.header_icon').css({
			'left': '-10px',
			'top': '5px',
			'width': '65px',
			'height': '65px'
		})
	})
	$('.header_icon').on('mouseout', () => {
		$('.menu_profile').hide();
		$('.header_icon').css({
			'left': '0px',
			'top': '0px',
			'width': '45px',
			'height': '45px'
		})
		clearTimeout(overTimer);
	})
	$('.menu_profile').on('mouseout', ev => {
		outTimer = setTimeout(function () {
			$('.menu_profile').hide();
			$('.header_icon').css({
				'left': '0px',
				'top': '0px',
				'width': '45px',
				'height': '45px'
			});
		}, 400)
	})

	let scrollFunc = e => {
		e = e || window.event;
		if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件               
			if (e.wheelDelta > 0) { //当滑轮向上滚动时  
				return true;
			}
			if (e.wheelDelta < 0) { //当滑轮向下滚动时  
				return false;
			}
		} else if (e.detail) {
			//Firefox滑轮事件  
			if (e.detail < 0) { //当滑轮向上滚动时  
				return true;
			}
			if (e.detail > 0) { //当滑轮向上滚动时  
				return false;
			}
		}
	}

	let showHeader = (e, fn) => {
		if ($(window).scrollTop() > 200) {
			if (!fn(e)) {
				$('.navself').addClass('is_visible');
			} else {

				$('.navself').removeClass('is_visible');
			}
		}
	}

	//给页面绑定滑轮滚动事件  
	if (document.addEventListener) { //firefox  
		document.addEventListener('DOMMouseScroll', function (e) {
			showHeader(e, scrollFunc);
		}, false);
	}
	//滚动滑轮触发scrollFunc方法  //ie 谷歌  
	if (window.onmousewheel) {
		window.onmousewheel = function (e) {
			showHeader(e, scrollFunc);
		};
	} else {
		document.onmousewheel = function (e) {
			showHeader(e, scrollFunc);
		}
	}



})