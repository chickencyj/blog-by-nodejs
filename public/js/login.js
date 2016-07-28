require('../css/login_reg.css');
let $ = require("jquery");
let canvas = require('./common/canvas.js');
let user = require('./common/user.js');
$(() => {
	let lf,
			$vers;
	$("#signinName").data('message', '用户名不能为空');
	$("#signinPwd").data('message', '密码不能为空');

	$("#signinName").blur(function() {
		user.loginfication( $(this) )
	})
	$("#signinPwd").blur(function() {
		user.loginfication( $(this) )
	})

	$('#login_btn').click(function() {
		user.loginfication( $("#signinName") );
		user.loginfication( $("#signinPwd") );
		lf = true;
		$vers = $(".login_form").find(".ver");
		for (let i=0; i<$vers.length; i++) {
			//console.log($vers.eq(i).data("onoff"))
			if( !$vers.eq(i).data("onoff") ){
				$vers.eq(i).css("backgroundColor", "#FCFCD6");
				user.showError($vers.eq(i));
				lf = false;
			}
		}
		return lf;
	})

	//-------------------------------canvas----------------------------
	let w = document.documentElement.clientWidth,
    	h = document.documentElement.clientHeight-50,
    	Canvas = document.getElementById("loginCanvas"),
    	Ctx = Canvas.getContext("2d"),
			dxdy = [],
    	AllRound = [];
	Canvas.width = w;
	Canvas.height = h;
	canvas.initRound(canvas.Round, Canvas, AllRound);
	canvas.roundMove(Canvas, Ctx, dxdy, AllRound);
})
