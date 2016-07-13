require('../css/login_reg.css');
let $ = require("jquery");
let canvas = require('./common/canvas');
let user = require('./common/user');
$(() => {
	let rf,
			$vers;
	$("#signupName").data('message', '用户名不能为空');
	$("#email").data('message', '邮箱不能为空');
	$("#signupPwd").data('message', '密码不能为空');
	$("#confirmPwd").data('message', '重复密码不能为空');

	//用户名
	$("#signupName").blur(function() {
		user.verification( $(this) )
	})
	//邮箱
	$("#email").blur(function() {
		user.verification( $(this) );
	})
	//密码
	$("#signupPwd").blur(function() {
		user.verification( $(this) );
	})
	//确认密码
	$("#confirmPwd").blur(function() {
		user.verification( $(this) );
	})

	//注册提交按钮
	$("#reg_btn").click(() => {
		rf = true;
		$vers = $(".reg_form").find(".ver");
		for (let i=0; i<$vers.length; i++) {
			//console.log($vers.eq(i).data("onoff"))
			if( !$vers.eq(i).data("onoff") ){
				$vers.eq(i).css("backgroundColor", "#FCFCD6");
				user.showError($vers.eq(i));
				rf = false;
			}
		}
		return rf;
	})

	//-------------------------------canvas----------------------------
	let w = document.documentElement.clientWidth,
    	h = document.documentElement.clientHeight,
    	Canvas = document.getElementById("regCanvas"),
    	Ctx = Canvas.getContext("2d"),
			dxdy = [],
    	AllRound = [];
	regCanvas.width = w;
	regCanvas.height = h;
	$('.reg_form').css('left',(w - $('.reg_form').innerWidth())/2+'px');
	$('.reg_form').css('top',(h - $('.reg_form').innerHeight())/2+'px');
	canvas.initRound(canvas.Round, Canvas, AllRound);
	canvas.roundMove(Canvas, Ctx, dxdy, AllRound);
})
	