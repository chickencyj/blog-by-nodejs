
基于express+mongoose+jquery+bootstrap+ES6+webpack搭建的多人博客社区
========================================

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

docker: env=pro
----
- 安装docker
- 切换分支到feat-docker git clone
- cd 到目录
- docker-compose -f ./docker/docker-compose.yml up --build

运行与使用:
----
1. 启动数据库`mongod` 以及 安装 yarn (https://yarnpkg.com/en/docs/install)
2.  使用命令行工具在该项目目录下使用 
- yarn satrt
- yarn start:HMR 
- yarn start: prod
- yarn test具体
- 具体请到package.json查看
3. 默认是使用3000端口，可到app.js中将const port = process.env.PORT || 3000 中3000改为你需要的端口，运行成功可在命令行看到Blog satrt on port:3000;

