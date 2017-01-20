// if (process.env.NODE_ENV !== 'production') {
//   require('../../app/views/main/article.ejs')
// }
require('../css/article.css');
let $ = require("jquery");
module.exports = $(() => {
    $('[data-toggle="popover"]').popover();
})