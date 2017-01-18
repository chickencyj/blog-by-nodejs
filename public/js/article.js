require('../css/article.css');
if(module.hot) {
    module.hot.accept();
}
let $ = require("jquery");
module.exports = $(() => {
		$('[data-toggle="popover"]').popover();
})