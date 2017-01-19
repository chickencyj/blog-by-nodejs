require('../css/article.css');
let $ = require("jquery");
module.exports = $(() => {
    $('[data-toggle="popover"]').popover();
})