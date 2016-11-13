var baseHttp=location.origin;
//         var baseHttp="http://localhost:8080";
        //
    // var baseHttp="http://172.17.10.97:8080";
        // var baseHttp="http://scandev.xs1h.com";
    angular.module('actApp', ["ionic"])
        .run(['$http',function($http){
            var wxCheckSignHost = location.href.split('#')[0];//获取当前的地址
            $http.post(baseHttp+"/index/getWeChatJsSign?url=" + wxCheckSignHost,{test:1}).success(function (data, status, headers, config) { //获取微信登陆Config
                if (data.statusCode == 0) {//获取成功
                    wx.config(angular.fromJson(data.data));//添加到微e信的config
                    wx.ready(function () {//微信准备成功
                        wx.hideOptionMenu();//隐藏微信按钮
                    });
                }
            });
        }])
    .config(function($stateProvider,$urlRouterProvider){
        	//配置状态机
        	$stateProvider
        	.state("sack",{
        		templateUrl:"activity/sack.html",
        		controller: "sackCtrl"
        	})
        })
    .controller("actCtrl",function($scope,$http,$templateCache,$state){
	//切换到状态 : sack
	$state.go("sack");
    })
    .controller("sackCtrl",function($scope,$http,$templateCache){
	        $scope.ltModal = {};
            // $scope.enrollstate=true;
            $http.post(baseHttp + '/activities/findMember',{tets:1}).success(function (data){
                if (!data.data||!data.data.phone) {
                    $scope.enrollstate=false;
                }else{
                    $scope.enrollstate=true;
                    $scope.phone=+data.data.phone;
                }
            });
            $scope.join = function () {
                window.location.href = $scope.url;
            };
            var cach=false;
            $scope.chihuo=["恭喜您！抽中1.5元优惠券1张"];
            $scope.shishen=["恭喜您！抽中2.5元优惠券1张"];
            $scope.taotie=["恭喜您！抽中4元优惠券1张"];
            $scope.showAlert = function(){
                var phone=$scope.phone;
                if(cach) return;
                if(phone){
                    cach=true;
                    $http.post(baseHttp+"/activities/randomActivities",{"activityId":3,"phone": phone}).success(function(data){
                        if(data.statusCode == 0){
                            $scope.hide=false;
                            $scope.ltModal.show=true;
                            $scope.ltModal.button="领取";
                            $scope.ltModal.time="立即下单，至门店凭号取餐不排队";
                            if (data.data.price==1.5) {
                                $scope.ltModal.title=$scope.chihuo[0];
                                $scope.fudai=1;
                            }else if(data.data.price==2.5){
                                $scope.ltModal.title=$scope.shishen[0];
                                $scope.fudai=2;
                            }else if(data.data.price==4){
                                $scope.ltModal.title=$scope.taotie[0];
                                $scope.fudai=3;
                            }
                            else{
                                $scope.ltModal.title=data.statusMessage;
                                $scope.fudai=4;
                            }
                            $scope.ltModal.ok=function(){
                            window.location.href = baseHttp + "/index/indexpage?type=1";
//                            $scope.url = baseHttp + "/index/indexpage?type=1";
                            };
                    }else if(data.statusCode == -1){
                            $scope.hide=true;
//                            $scope.hide=false;
                            cach=false;
                            $scope.ltModal.show=true;
                            $scope.fudai=4;
//                            $scope.fudai=3;
                            $scope.ltModal.title=data.statusMessage;
                            $scope.ltModal.button="攒人品";
                            $scope.ltModal.time="明天记得早点来哦！";
                            $scope.ltModal.ok=function(){
                            window.location.href = baseHttp + "/index/indexpage?type=1";
                            };
                        }
                    })
                }
            }
});