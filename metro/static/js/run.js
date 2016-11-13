/**
* xs1h Module
*
* Description
*/
angular.module('xs1h').run(['$rootScope',"$http",function($rootScope,$http) {
	var wxCheckSignHost=location.href.split("#")[0]
	$http.post("index/getConfig",{texr:1}).success(function (data) {
		if(data.statusCode==0){
			$rootScope.global=data.data;
		}
	});
	 $http.post("index/getWeChatJsSign?url=" + wxCheckSignHost, {url: wxCheckSignHost}).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
            	var cofig=angular.fromJson(data.data);
                wx.config(cofig);
                wx.ready(function () {
                    wx.hideOptionMenu();
                    $rootScope.wxReady=true;
                    //wx.scanQRCode({
                    //    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    //    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    //    success: function (res) {
                    //        if (res.resultStr.indexOf(",") != -1) {
                    //            location.href = "http://w.url.cn/s/" + res.resultStr.split(",")[1]; // 条形码跳转
                    //        }
                    //        else {
                    //            location.href = "http://w.url.cn/s/" + res.resultStr; // 二维码跳转
                    //        }
                    //    }
                    //});
                });
            }
        });
}]);