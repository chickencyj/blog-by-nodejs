
基于express+mongoose+jquery+bootstrap+ES6+webpack搭建的多人博客社区
========================================

简介:
---------------

**1. 项目后端搭建:**
  * 使用`express`框架完成电影网站后端搭建;
  * 使用`mongoose`完成对`mongodb`数据的操作以及构建;
  * 使用`ejs`模板引擎完成页面创建渲染;
  * 使用`moment`模块解决博客存储时间;
  * 使用`maked`模块对文章存储进行格式化使其支持markdown格式编写博客;
  * 使用`ES6的promise对象`解决多次回调的操作;
  * 使用`mongoose的populate方法`解决多个数据模型相互关联的问题;

**2. 项目前端搭建:**
  * 结合webpack使用`commonjs规范`模块化编写;
  * 部分使用了`HTML5以及CSS3编写`，可能会造成部分浏览器的不兼容;
  * 使用`jQuery`和`Bootsrap`完成网站前端JS脚本和样式处理;
  * 使用`header.js`完成函数节流以及滚轮事件对于header导航条的控制;
  * 使用`canvas.js`通过`面向对象`与`canvas`绘制注册登录页的背景;
  * 使用`user.js`通过`ajax`与后端交互完成对账号登录注册的判断;
  * 使用`textAjax.js`通过`ajax`请求完成主页以及作者文章页的`加载更多`(同分页原理);
  * 使用`imgAjax.js`通过`ajax`请求实现`瀑布流`(同分页原理);
  * 使用`upload.js`通过`ajax`以及`HTML5的FormData()对象`实现图片的无刷新上传;
  * 文章评论直接使用了`多说`的插件;

**3. 本地开发环境搭建:**
  * 使用`webpack`集成`Uglify`,`babel`等实现ES6编译以及压缩等功能，使用`mocha-webpack`完成用户注册,文章存储,标签存储等步骤的简单单元测试。

**4. 网站整体功能:**

  网站正常访问无需管理原权限,以下网站数据的添加及删除功能需要注册帐号方能使用。
  如需管理其他user的任何数据,则需自行在mongodb中将个人账户的`role值提升至50以上`。

  * 所有文章(按发表时间排序);
  * 某个作者的所有文章(按发表时间排序);
  * 文章内容;
  * 某标签的所有文章;
  * 搜索结果的所有相关文章(文章标题相关);
  * 文章的发表更改删除;
  * 用户名以及个性签名以及个人头像的更新修改;
  * 用户名密码的更新修改;
  * 文章访客统计以及作者文章总访客统计;
  * 在文章内容页有文章热度排行(前10)以及常用标签列表(前10);

项目整体效果
-------
[动态效果演示](http://7xsn9b.com1.z0.glb.clouddn.com/blog.gif)



运行环境:
-------
在Mac下的node 6.0.0版本,express4.13.1版本运行正常

安装:
----
- 安装node(https://nodejs.org/en/);
- 安装express框架(npm install express -g);
- 安装mongodb(https://www.mongodb.org/downloads#production)查看说明完成相关环境以及配置搭建;
- 在当前项目目录中使用npm install命令安装相关模块(<a href="http://npm.taobao.org/" target="\_blank">如果模块下载速度慢可考虑使用淘宝cnpm镜像进行下载</a>);

运行与使用:
----
1. 启动数据库`mongod`
2. 使用命令行工具在该项目目录下使用 `npm start` 或者 `node app.js` 运行程序,默认是使用3000端口，可到app.js中将const port = process.env.PORT || 3000 中3000改为你需要的端口，运行成功可在命令行看到Blog satrt on port:3000;


项目页面:
-------
```
main: '/'
 	main: '/'
	 	首页：/
	 	作者文章页：/author/:id
	 	文章内容页：/article/:id
	 	标签：/article/tag/:id
	 	搜索结果页：/results
	user: '/user'
		登录页：/user/login
		注册页：/user/reg

admin: '/admin'
	article: '/article'
		发表文章页：/admin/article/post
		文章列表页：/admin/article/author/:id
		修改文章页：/admin/article/edit/:id
	user: '/user'
		setprofile页：/admin/user/setprofile
		setavator页（上传）：/admin/user/setavator
		修改密码页：/admin/user/resetpwd

api: '/api'
	main: '/'
		发表文章或者修改文章：/api/post
		修改账户名或者签名：/api/signature
		上传图片：/api/avator
		修改密码：/api/pwd
		删除文章：/api/deart

	user: '/user'
		注册：/api/user/reg
		登录：/api/user/login
		登出：/api/user/logout
		ajax检查用户名：/api/user/checkUserName
		ajax检查邮件： /api/user/checkEmail

	showmore: '/showmore'
		首页加载更多：/api/showmore/index
		作者文章页加载更多：/api/showmore/author
		标签页加载更多：/api/showmore/tag
		搜索结果页加载更多：/api/showmore/results

manager: '/manager'
	main: '/'
		管理员页：/manager
```

项目结构:
----
```
├── .tmp												测试生成的sourcemaps等相关文件，方便调试
│   ├── ****   
│   │   ├── **** 
│   │   ├── ****
│   │   └── ****   
├── app													MVC目录
│   ├── controllers							控制器目录
│   │   ├── admin								注册用户权限控制器目录
│   │   │   ├── article
│   │   │   └── user
│   │   ├── api									api接口
│   │   │   ├── main
│   │   │   ├── showmore
│   │   │   └── user
│   │   ├── main 								普通用户控制器目录
│   │   │   ├── main
│   │   │   └── user
│   │   ├── manager							管理员控制器目录
│   │   │   └── main
│   ├── models									模型目录
│   │   ├── article
│   │   ├── tag
│   │   └── user
│   ├── schemas									模式目录
│   │   ├── article
│   │   ├── tag
│   │   └── user
│   └── views										视图文件目录
│   │   ├── admin								注册用户视图目录(文件夹)
│   │   ├── common							公共视图目录(文件夹)
│   │   ├── main								普通视图目录(文件夹)
│   │   ├── manager							管理员视图目录(文件夹)
│   │   └── error								404页面视图
├── configs											路由目录
│   ├── admin										注册用户路由
│   ├── api											api路由
│   ├── main										普通用户路由
│   └── manager									管理员路由
├── node_modules								node模块目录
├── public											静态文件目录
│   ├── assets									webpack output输出目录(文件夹)
│   ├── css											样式目录
│   │   ├── common							公共样式目录
│   │   │   ├── header.css 			导航条样式
│   │   │   └── reset.min.css 	重置样式以及可复用样式
│   │   ├── article.css        
│   │   ├── author_index.css
│   │   ├── blog.css        
│   │   ├── login_reg.css
│   │   ├── manager.css        
│   │   └── result_tag.css
│   ├── images									图片目录(文件夹)
│   ├── js											JS脚本目录
│   │   ├── common							依赖模块目录(文件夹)
│   │   ├── article.js
│   │   ├── articlelist.js
│   │   ├── author.js
│   │   ├── header.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── result.js
│   │   ├── tag.js
│   │   └── upload.js
│   ├── libs										需要引用的库或者框架
│   │   ├── bootstrap
│   │   └── jquery
│   └── upload									用户自定义上传头像图片存储目录
├── test												测试文件目录
│   └── article
│   │   └── article.test.js
│   └── tag
│   │   └── tag.test.js
│   └── user
│       └── user.test.js
├── app.js 											项目入口文件
├── package.json 								项目所需模块以及配置信息     
├── webpack.config-test.js			webpack-mocha测试配置文件
└──  webpack.config.js 					webpack配置文件
```

后期完善:
-------
1. 后台管理员功能没有完善，例如对于用户的删除修改;
2. 发表文章时对于空白标签没有做特殊处理;
3. 视图公共部分还可以进一步拆分;
4. 注册登录后对用户cookies的处理还待进一步优化;
5. 浏览器兼容性;
6. 完善网站功能;
7. 优化项目代码;
