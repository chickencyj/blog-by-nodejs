require('../css/manager.css');
if (module.hot) {
	module.hot.accept();
}
let $ = require("jquery");
$(() => {
	let img = document.getElementById('img');

	if (!window.File && !window.FileList && !window.FileReader && !window.Blob) {
		$('.upload_info').html('"您的浏览器不支持HTML5上传"');
		$('.upload_info').show();
	}
	$('#upload_img img').on('drag', ev => {
		let e = ev || event;
		e.preventDefault();
	})
	$('#upload_img img').on('dragenter', ev => {
		let e = ev || event;
		e.preventDefault();
	})
	$('#upload_img img').on('dragover', ev => {
		let e = ev || event;
		e.preventDefault();
	})
	// $('#upload_img img').on('dragend', function() {
	// 	ev.preventDefault();
	// })
	$('#upload_img img').on('drog', () => {
		let e = ev || event;
		e.preventDefault();

		let xhr = new XMLHttpRequest();

		xhr.onload = () => {
			//console.log(this.responseText);
			let data = JSON.parse(this.responseText);
			message.innerHTML = '上传成功';
			$('#upload_img img').attr('src', data.path);
			console.log($('.header_icon'));
			$('.header_icon').attr('src', data.path);
		}

		xhr.open('post', '/api/avator', true);

		//xhr.upload : 上传进度对象
		xhr.upload.onloadstart = () => {
			console.log('开始上传');
		}
		xhr.upload.onprogress = ev => {
			console.log('正在上传：' + ev.loaded + ' / ' + ev.total);

			let a = ev.loaded / ev.total;
			console.log(a);
			$('#upload_img .progress-bar').css('width', (a * 100) + '%');
			$('#upload_img .progress-bar').html(parseInt(a * 100) + '%');

		}
		xhr.upload.onload = function () {
			console.log('上传完成');
			$('#upload_img .progress-bar').css('width', '200px');
			$('#upload_img .progress-bar').html('上传完成');
		}

		let fd = new FormData();
		fd.append('f', ev.dataTransfer.files[0]);
		xhr.send(fd);
	})

	$('#upload_img .btn').on('click', ev => {
		let e = ev || event;
		e.preventDefault();

		let xhr = new XMLHttpRequest();

		xhr.onload = function () {
			let data = JSON.parse(this.responseText);
			$('#upload_img img').attr('src', data.path);
			$('.header_icon').attr('src', data.path);
		}

		xhr.open('post', '/api/avator', true);

		//xhr.upload : 上传进度对象
		xhr.upload.onloadstart = () => {
			console.log('开始上传');
		}
		xhr.upload.onprogress = ev => {
			console.log('正在上传：' + ev.loaded + ' / ' + ev.total);

			let a = ev.loaded / ev.total;
			$('#upload_img .progress-bar').css('width', (a * 100) + '%');
			$('#upload_img .progress-bar').html(parseInt(a * 100) + '%');
		}
		xhr.upload.onload = () => {
			console.log('上传完成');
			$('#upload_img .progress-bar').css('width', (100 + '%'));
			$('#upload_img .progress-bar').html('上传完成');
		}
		let fd = new FormData();
		fd.append('f', img.files[0]);
		xhr.send(fd);
	})
})