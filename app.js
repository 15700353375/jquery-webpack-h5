import $ from "jquery";
// import './src/js/share.js';
// 设置全局变量
window.$ = $;



// var url = 'http://api.huixuebang.com';
var url = 'http://192.168.0.99:9130';

function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}



window.onload = function () {

	// 打开关闭立即注册
	$('#immediately_register').click(function() {
		$('#modal_register').fadeIn();
	})

	// 打开关闭注册成功提示
	$('#register_submit').click(function() {
		register();		
	})


	// 获取验证码
	$('#getcode').click(function () {
		getcode();
	});



	// 注册成功下线
	$('#modal_downLoad').click(function () {
		var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if(isiOS){
			$('#modal_downLoad').attr('href', 'https://itunes.apple.com/cn/app/%E6%B1%87%E5%AD%A6%E9%82%A6-%E8%BD%BB%E6%9D%BE%E5%AD%A6%E6%87%82-%E5%BF%AB%E9%80%9F%E8%BF%87%E5%85%B3/id1271293855?mt=8'); 
		}else{
			$('#modal_downLoad').attr('href', 'https://hxbang.oss-cn-shanghai.aliyuncs.com/apk/huixuebang.apk');
		}
	});
	
}

// 获取验证码
function getcode() {
	var regPho = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	var mobile = $('#phoneNo').val();
	console.log($('#phoneNo').val())
	if (mobile) {
		if (!regPho.test(mobile)) {
			error('您输入的手机号不符合规范，请重新输入');
          	return;
        };
	}else{
		error('请输入手机号');
    return;
	}

	
							
	$.ajax({
	    type: "get",
	    url: url + '/user-api/sendMsg/' + mobile,
	    contentType: "application/json; charset=utf-8",
	    timeout: 5000,
	    success: function (data) {
	        if (data.code === "000000") {
	        	console.log('成功')
						$('#getcode').attr('disabled',true)
							var time = 60
							var interval = window.setInterval(function () {
								$('#getcode').text('已发送('+time+'s)');
									if ((time--) <= 0) {
										$('#getcode').attr('disabled',false)
										$('#getcode').text('获取验证码');
											window.clearInterval(interval)
									}
								}, 1000)
	        } else {
	        	console.log(data)
	        	error('验证码发送频繁，请稍后再试');
	        }
	    },
	    error: function (data) {
				console.log(data)
	        error('网络错误');
	    }
	})
}

// 注册
function register () {
	var regPho = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	var reg = /^.{6,20}$/;
	var mobile = $('#phoneNo').val();
	var password = $('#passwordNo').val();
	var code = $('#codeNo').val();
	var refereeUid = '';
	const theRequest = GetRequest();
	if (theRequest.num) {
		refereeUid = theRequest.num
	};
	if (mobile) {
		if (!regPho.test(mobile)) {
			error('您输入的手机号不符合规范，请重新输入');
          	return;
        };
	} else {
		error('手机不能为空，请输入手机号');
		return;
	};

	if(!code){
		error('验证码不能为空');
		return;
	}
	if (password) {
		if (!reg.test(password)) {
			error('您输入的密码不符合规范，请输入6~20位密码');
          	return;
        };
	} else {
		error('密码不能为空，请输入6~20位密码');
		return;
	};
	
	
	var data = {
		mobile: mobile,
		password: password,
		code: code,
		refereeUid: refereeUid,
		// 免费开通的课程信息
		courseNoA: 'JF212',
		// courseNoB: 'SY211',
		signLevelA: 1,
		// signLevelB: 0,
	};
	$.ajax({
	    type: "post",
	    url: url + '/user-api/register/freeCourse',
	    dataType: "json",
	    contentType: "application/json; charset=utf-8",
	    data: JSON.stringify(data),
	    timeout: 5000,
	    success: function (data) {
	        if (data.code === "000000") {
						$('#enroll').hide();
						$('#modal_register').fadeOut();
						$('#modal_success').fadeIn();
	        } else {
	        	if (data.code === '000001') {
							error(data.message);
	        	}else {
	        		error('网络问题，请稍后重试');
	        	}
	        }
	    },
	    error: function (data) {
	        console.log(data);
	        error('网络错误');
	    }
	})
}


// 错误处理
function error (msg) {
	var time = 3
	$('#errorTips').html(msg + '(3秒)');
	$('#errorTips').show();
	var timer = window.setInterval(function () {
			time--;
			$('#errorTips').html(msg + '(' + time + '秒)');
			console.log(time)
	        if (time <= 0) {
	        	$('#errorTips').hide();
	          window.clearInterval(timer)
	        }
	      }, 1000)
}