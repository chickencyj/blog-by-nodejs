const Index = require('../app/controller/index');
const Post = require('../app/controller/post');
const Users = require('../app/controller/users');
const Author = require('../app/controller/author');




module.exports = (app) => {
	app.get('/', Index.index);
/**
 * 
 */
 	app.get('/results', Post.search);
	app.get('/login', Users.signUpRequired, Users.login);
	app.post('/login', Users.signUpRequired, Users.signIn);

	app.get('/reg', Users.signUpRequired, Users.register);
	app.post('/reg', Users.signUpRequired, Users.signUp);

	app.get('/api/checkUserName', Users.checkUserName)
	app.get('/api/checkEmail', Users.checkEmail)

	app.get('/user/logout', Users.signInRequired, Users.logout)
	app.get('/user/setprofile', Users.signInRequired, Users.setprofile);
	app.get('/user/setavator', Users.signInRequired, Users.setavator);
	app.get('/user/resetpwd', Users.signInRequired, Users.resetpwd);

	app.post('/user/signature', Users.signInRequired, Users.signature);
	app.post('/user/upload', Users.signInRequired, Users.avator);
	app.post('/user/pwd', Users.signInRequired, Users.pwd);
	app.get('/admin/config', Users.signInRequired, Users.AdminRequired, Users.config);

	

	app.get('/user/articles/:id', Users.signInRequired, Author.articles);

	app.get('/user/post/edit/:id', Users.signInRequired, Post.edit);
	app.get('/user/post', Users.signInRequired, Post.publish);
	app.post('/user/post', Users.signInRequired, Post.post);
	app.delete('/user/post/delete', Users.signInRequired, Post.delete);
/**
 * 
 */

	app.get('/author/showmore', Author.showmore);
	app.get('/results/showmore', Post.moreResults);
 	app.get('/post/tag/:id', Post.tag);
 	app.get('/api/post/tag/showmore', Post.showmoreTag);
	app.get('/post/showmore', Post.showmore);
	app.get('/post/:id', Post.article);
	

	app.get('/author/:id', Author.index);
	


}