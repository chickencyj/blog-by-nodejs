module.exports = (() => {
		//用户名
		let isUser = aUser => {
			let bValidate = RegExp(/^\w{3,20}/).test(aUser);
			if(bValidate){
				return true;
			} else {
				return false;
			}
		}

		//密码
		let isPassWord = passWord => {
			let bValidate = RegExp(/^\w{3,20}/).test(passWord);
			if(bValidate){
				return true;
			}else{
				return false;
			}
		}
		//邮箱
		let isEmail = aEmail => {
			let bValidate = RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(aEmail);
			if (bValidate) {
				return true;
			} else {
				return false;
			}
		}

		let showError = $obj => {
			$obj.next().html( $obj.data('message') ).fadeIn();
		}

		let _ajax = (obj, _url) => {
			$.ajax({
				url: _url,
				data: {
					email: obj.val(),
					username: obj.val()
				},
				dataType: 'json',
				success: data => {
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
		let verification = (obj, url) => {
			let sVal = obj.attr("name");
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
				_ajax(obj, '/api/user/checkUserName');
			}

			if (sVal == "user[email]") {
				if (!isEmail(obj.val())) {
					obj.data("onoff", false);
					obj.data('message', '邮箱格式不对');
					showError(obj);
					return;
				}
				_ajax(obj, '/api/user/checkEmail');
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

		let loginfication = obj => {
			let sVal = obj.attr("name");
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