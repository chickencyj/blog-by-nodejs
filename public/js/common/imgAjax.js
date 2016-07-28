module.exports = (() => {
	let createImgList = (index,data,parent) => {
		 $(
			'<figure class="col-lg-4 col-md-6 col-sm-6">' +
			'<a href="/article/'+ data._id +'" class="thumbnail blog_tag_article">' +
			'<img src="/images/tag' + index + '.jpg">' +
			'<figcaption class="caption">' +
			'<h5>' + data.title + '</h5>' +
			'</figcaption>' +
			'</a>' + 
			'</figure>').appendTo($(parent)).css({'marginTop':'200px','opacity':0}).animate({'marginTop':0,'opacity':1},1200);;
		}


	let getImgMore = (flag, page, url, parent) => {
		let showmore,
				index;
		$.ajax({
			type: 'GET',
			url: url+ page
			})
		.done((results) => {
			showmore = results.showmore;

			if (!results.articles.length) {
				return;
			}
			console.log(22222);
			results.articles.forEach((article,index) => {
				index = index%3 + 1;
				createImgList(index,article,parent);
			})

			flag.value = true;
		})
	}

	return {
		getImgMore: getImgMore
	}
})()
