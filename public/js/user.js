
module.exports = $(function(){
	var rf = true,
			lf = true;
	var user = (function(){
		//用户名
		var isUser = function(aUser) {
			var bValidate = RegExp(/^\w{3,20}/).test(aUser);
			if(bValidate){
				return true;
			} else {
				return false;
			}
		}

		//密码
		var isPassWord = function(passWord){
			var bValidate = RegExp(/^\w{3,20}/).test(passWord);
			if(bValidate){
				return true;
			}else{
				return false;
			}
		}
		//邮箱
		var isEmail = function(aEmail) {
			var bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
			if (bValidate) {
				return true;
			} else {
				return false;
			}
		}

		var showError = function($obj) {
			$obj.next().html( $obj.data('message') ).fadeIn();
		}

		var _ajax = function(obj, _url) {
			$.ajax({
				url: _url,
				data: {
					email: obj.val(),
					username: obj.val()
				},
				dataType: 'json',
				success: function(data) {
					if (data.errorCode) {
						obj.data("onoff", false);
						obj.data('message', data.message);
						showError(obj);
					} else {
						obj.data("onoff", true);
					}
				}
			});
		}
		/**
		 * [verification description] 注册认证
		 * @param  {[type]} obj [description] input元素
		 * @param  {[type]} url [description] ajax地址
		 * @return {[type]}     [description]
		 */
		var verification = function(obj, url){
			var sVal = obj.attr("name");
			obj.next().html("");
			if( obj.val() == "" ){
				obj.data("onoff", false);
				showError(obj);
				return;
			}

			if (sVal == "user[name]") {
				if( !isUser(obj.val()) ){
					obj.data("onoff", false);
					obj.data('message', '用户名格式不对');
					showError(obj);
					return;
				}
				_ajax(obj, '/api/checkUserName');
			}

			if (sVal == "user[email]") {
				if (!isEmail(obj.val())) {
					obj.data("onoff", false);
					obj.data('message', '邮箱格式不对');
					showError(obj);
					return;
				}
				_ajax(obj, '/api/checkEmail');
			}

			if (sVal == "user[password]") {
				if( !isPassWord( obj.val()) ){
					obj.data("onoff", false);
					obj.data('message', '密码为3-20字母或者数字组合');
					showError(obj);
				} else{
					obj.data("onoff", true);
				}
			}
			if( obj.val() !== $("#signupPwd").val() && sVal == "user[comfirmpwd]"){
				console.log(11111111);
				obj.data("onoff", false);
				obj.data('message', "两次密码不一致");
				showError(obj);
			} else {
				obj.data("onoff", true);
			}
		}

		var loginfication = function(obj) {
			console.log(obj.val())
			var sVal = obj.attr("name");
			obj.next().html("");
			if( obj.val() == "" ){
				obj.data("onoff", false);
				console.log(111111);
				showError(obj);
				return;
			}

			if (sVal == "user[name]") {
				if( !isUser(obj.val()) ){
					obj.data("onoff", false);
					obj.data('message', '用户名格式不对');
					showError(obj);
					return;
				}
			} else {
					obj.data("onoff", true);
			}

			if (sVal == "user[password]") {
				if( !isPassWord( obj.val()) ){
					obj.data("onoff", false);
					obj.data('message', '密码为3-20字母或者数字组合');
					showError(obj);
				} else{
					obj.data("onoff", true);
				}
			} else {
					obj.data("onoff", true);
			}
		}

		return {
			verification: verification,
			loginfication: loginfication,
			showError: showError
		}

	})()

//-------------------------reg---------------------------------
	$("#signupName").data('message', '用户名不能为空');
	$("#email").data('message', '邮箱不能为空');
	$("#signupPwd").data('message', '密码不能为空');
	$("#confirmPwd").data('message', '重复密码不能为空');

	//用户名
	$("#signupName").blur(function(){
		user.verification( $(this) )
	})
	//邮箱
	$("#email").blur(function(){
		user.verification( $(this) );
	})
	//密码
	$("#signupPwd").blur(function(){
		user.verification( $(this) );
	})
	//确认密码
	$("#confirmPwd").blur(function(){
		console.log(111);
		user.verification( $(this) );
	})

	//注册提交按钮
	$("#reg_btn").click(function(){
		rf = true;
		$vers = $(".reg_form").find(".ver");
		for (var i=0; i<$vers.length; i++) {
			//console.log($vers.eq(i).data("onoff"))
			if( !$vers.eq(i).data("onoff") ){
				$vers.eq(i).css("backgroundColor", "#FCFCD6");
				user.showError($vers.eq(i));
				rf = false;
			}
		}
		return rf;
	})
//----------------------login------------------------------------
	$("#signinName").data('message', '用户名不能为空');
	$("#signinPwd").data('message', '密码不能为空');

	$("#signinName").blur(function(){
		user.loginfication( $(this) )
	})
	$("#signinPwd").blur(function(){
		user.loginfication( $(this) )
	})

	$('#login_btn').click(function(){
		lf = true;
		$vers = $(".login_form").find(".ver");
		for (var i=0; i<$vers.length; i++) {
			//console.log($vers.eq(i).data("onoff"))
			if( !$vers.eq(i).data("onoff") ){
				$vers.eq(i).css("backgroundColor", "#FCFCD6");
				user.showError($vers.eq(i));
				lf = false;
			}
		}
		return lf;
	})

//---------------------------canvas----------------------------------
		var w = document.documentElement.clientWidth,
    		h = document.documentElement.clientHeight,
				regdxdy = [],
				logindxdy = [],
    		regAllRound = [],
    		loginAllRound = [];


    
    //随机数函数
    var fnRandom = function(min,max){
      return Math.floor((max-min)*Math.random()+min+1)
    }

    var Round = function(canvas){
      this.r = Math.floor(Math.random()*8)+8 ;
      this.diam = this.r*2;
      //随机位置
      var x = fnRandom(0,canvas.width - this.r);
      this.x = x<this.r?this.r:x;
      var y = fnRandom(0,canvas.height-this.r);
      this.y = y<this.r?this.r:y
      //随机速度
      var speed = fnRandom(2,4)/10;
      this.speedX = fnRandom(0,4)>2.5?speed:-speed;
      this.speedY = fnRandom(0,4)>2.5?speed:-speed;
      //颜色
      
      this.color = "#eee";
    }
    Round.prototype.draw = function(ctx){
      //绘制函数
      ctx.fillStyle = this.color;
      ctx.beginPath()
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
      ctx.closePath();
      ctx.fill();
    }
    Round.prototype.move = function(canvas){
      
      if(this.x>canvas.width-this.r){
        this.speedX*= -1; 
        
      }else if(this.x<this.r){
        this.speedX*=-1;
      }
      this.x+=this.speedX;
      
      if(this.y>canvas.height-this.r){
        this.speedY*= -1;
      }else if(this.y<this.r){
        this.speedY*=-1;
      }
      this.y+=this.speedY;
    }
    var initRound = function(canvas, allRound){
      //初始化10个圆形对象,放到数组中
      for(var i = 0 ; i<10;i++){
        var obj = new Round(canvas);
        allRound.push(obj);
      }
    }
    var roundMove = function(canvas, ctx, dxdy, allRound, onoff){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      //遍历所有的圆形对象,让对象自己重绘,移动
      for (var i = 0 ;i <allRound.length;i++) {
        var round = allRound[i];
        round.draw(ctx);
        if (!onoff) {
					round.move(canvas);
        }
        
        dxdy[i]={
          dx:round.x,
          dy:round.y,
          dr:round.r,
          dvx:round.speedX,
          dvy:round.speedY
        };
        var dx = dxdy[i].dx,
          dy =dxdy[i].dy;
        
        for (var j=0;j<i;j++) {
					var sx = dxdy[j].dx,
	            sy = dxdy[j].dy,
          		l = Math.sqrt((dx-sx)*(dx-sx)+(dy-sy)*(dy-sy)),
							C = 1/l*7-0.0008,
							o = C > 0.03 ? 0.02 : C;
          ctx.strokeStyle = 'rgba(0,0,0,'+ o +')';
          ctx.beginPath();
          ctx.lineWidth=2;
          ctx.moveTo(dx,dy);
          ctx.lineTo(sx,sy);
          ctx.closePath();
          ctx.stroke();
        }
      }
      if (!onoff) {
      	window.requestAnimationFrame(function() {
	      	roundMove(canvas, ctx, dxdy, allRound,false);
	      })
      }
      
    }
    
    var regCanvas = document.getElementById("regCanvas"),
			  loginCanvas = document.getElementById("loginCanvas");


			  if (regCanvas) {
			  	var regCtx = regCanvas.getContext("2d");
			  	regCanvas.width = w;
			  	regCanvas.height = h;
			  	regCtx.clearRect(0,0,regCanvas.width,regCanvas.height);
			  	$('.reg_form').css('left',(w - $('.reg_form').innerWidth())/2+'px');
    			$('.reg_form').css('top',(h - $('.reg_form').innerHeight())/2+'px');
    			initRound(regCanvas, regAllRound);
    			roundMove(regCanvas, regCtx, regdxdy, regAllRound, false);
			  }
			  if (loginCanvas) {
			  	var loginCtx = loginCanvas.getContext("2d");
			  	loginCanvas.width = w;
    			loginCanvas.height = h;
    			loginCtx.clearRect(0,0,loginCanvas.width,loginCanvas.height);
    			$('.login_form').css('left',(w - $('.login_form').innerWidth())/2+'px');
    			$('.login_form').css('top',(h - $('.login_form').innerHeight())/2+'px');
					initRound(loginCanvas, loginAllRound);
					roundMove(loginCanvas, loginCtx, logindxdy, loginAllRound, false);
			  };
		// (function (doc, win) {
  //   	var docEl = doc.documentElement,
  //   	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
  //   	recalc = function () {
  //   		var w = docEl.clientWidth;
  //   		var h = docEl.clientHeight;
  //   		if (!w && !h) return;
  //   		docEl.style.fontSize = 20 * (w / 320) + 'px';
  //   		if (regCanvas) {
		// 	  	var regCtx = regCanvas.getContext("2d");
		// 	  	regCanvas.width = w;
		// 	  	regCanvas.height = h;
		// 	  	regCtx.clearRect(0,0,regCanvas.width,regCanvas.height);
		// 	  	$('.reg_form').css('left',(w - $('.reg_form').innerWidth())/2+'px');
  //   			$('.reg_form').css('top',(h - $('.reg_form').innerHeight())/2+'px');
  //   			roundMove(regCanvas, regCtx, regdxdy, regAllRound,true);
		// 	  }
		// 	  if (loginCanvas) {
		// 	  	var loginCtx = loginCanvas.getContext("2d");
		// 	  	loginCanvas.width = w;
  //   			loginCanvas.height = h;
  //   			loginCtx.clearRect(0,0,loginCanvas.width,loginCanvas.height);
  //   			$('.login_form').css('left',(w - $('.login_form').innerWidth())/2+'px');
  //   			$('.login_form').css('top',(h - $('.login_form').innerHeight())/2+'px');
		// 			roundMove(loginCanvas, loginCtx, logindxdy, loginAllRound,true);
		// 	  };
  //   	};
  //   	if (!doc.addEventListener) return;
  //   	win.addEventListener(resizeEvt, recalc, false);
  //   	doc.addEventListener('DOMContentLoaded', recalc, false);
  //   })(document, window);
			  
})