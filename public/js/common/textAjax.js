module.exports = (() => {
	let createTextList = (name,data,parent) => {
		$(
			'<div class="post-preview">'+
			'<a href="/post/'+data._id+'">'+
			'<h2 class="post-title">'+data.title+'</h2>'+
			'<div class="post-content-preview">'+data.text +'</div>'+
			'</a>'+
			'<p class="post-meta">' +
			'Posted by'+
			' <a href="/author/'+ data.author._id +'">'+ name +'</a>' +
			' on ' + data.meta.updateTime +
			'<span>' + data.pv + '浏览</span>' +
			'</p>'+
			'</div>'+
			'<hr />').appendTo($(parent)).hide().show('slow');
	}

	let getTextMore = (page, btn, url, parent) => {
		let showmore,
		time;
		$.ajax({
			type: 'GET',
			url: url+page.value
		})
		.done((results) => {
			showmore = results.showmore;
			results.articles.forEach((article,index) => {
				if (article.author.name) {
					name = article.author.name;
				} else {
					name = results.name;
				}
				time = article.meta.updateTime;
				article.meta.updateTime = time.substring(0,time.indexOf('T')).split('-').join('/');
				createTextList(name,article,parent);
			})
			if (showmore.len <= (showmore.page*showmore.count)+results.articles.length) {
				$(btn).hide();
			}
			page.value++;
		})
	}

	return {
		getTextMore: getTextMore
	}
})()