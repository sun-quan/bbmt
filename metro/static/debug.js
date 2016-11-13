// var httpBase="http://scandev.xs1h.com/";
var httpBase="http://localhost:8080/";
var httpBase="";
// var httpBase="http://172.17.10.72:8080/";

 angular.module("xs1h", ["ionic", "template"]).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
     $urlRouterProvider.when('', '/shop');
     $stateProvider.state('shop', {
             url: "/shop/:storeId/:orderNumber",
             views: {
                 mainContent: {
                     templateUrl: "template/shop.html",
                     controller: "shopCtrl"
                 }
             }
         }).state('orderpay',{
             url: "/orderpay?storeId&orderNumber",
             views:{
             	mainContent:{
             		templateUrl: "template/order-pay.html",
            		controller: "orderPayCtrl"
             	}
             }
           
         }).state('paysuccess', {
             url: "/paysuccess?orderNumber",
             views:{
             	mainContent:{
             		templateUrl: "template/pay-success.html",
            		controller: "paySuccessCtrl"
             	}
             }
           
         }).state('order', {
             url: "/order",
             templateUrl: "template/order.html",
             controller: "orderCtrl"
         })
         //$locationProvider.html5Mode(true);
         //$ionicConfigProvider.views.swipeBackEnabled(false);
         //$ionicConfigProvider.scrolling.jsScrolling(false);
       $httpProvider.interceptors.push('timestampMarker');

 }]);
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
(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/order-pay.html',
    '<ion-view class="pay">\n' +
    '    <ion-header-bar align-title="center" class="bar-energized">\n' +
    '<!--         <a class="btn-back" ng-click="go(-1)"></a>\n' +
    ' -->        <h1 class="title">订单支付</h1>\n' +
    '    </ion-header-bar>\n' +
    '    <ion-content overflow-scroll="false">\n' +
    '        <div >\n' +
    '            <div class="item item-divider">\n' +
    '                预定餐品\n' +
    '                <span class="pull-right">共{{order.commodityNumber}}件</span>\n' +
    '            </div>\n' +
    '            <ul class="list">\n' +
    '                <li class="xs-item1" ng-repeat="item in order.commodityList">\n' +
    '                    <img ng-src="{{global.adminUrl+item.commodityImg}}"/>\n' +
    '                    <div class="desc">\n' +
    '                        <p ng-bind="item.commodityName"></p>\n' +
    '                        <div class="bottom">\n' +
    '                            <span class="txt-price" ng-bind="item.promotion|currency :\'￥\'"></span>\n' +
    '                            <div class="number">\n' +
    '                                <span class="count" ng-bind="\'× \'+item.totalNum"></span>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '          \n' +
    '            \n' +
    '            <div class="item item-divider title">\n' +
    '                餐品费用\n' +
    '                <span class="pull-right" ng-bind="order.total|currency :\'￥\'"></span>\n' +
    '            </div>\n' +
    '           \n' +
    '            \n' +
    '            <div></div>\n' +
    '            <div class="item item-divider title">\n' +
    '                支付方式\n' +
    '            </div>\n' +
    '            <div class="payType">\n' +
    '                <i class="payIcon"></i>\n' +
    '                <span class="supportType">微信支付</span>\n' +
    '                <span class="tip">暂时只支持微信支付</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '     \n' +
    '    </ion-content>\n' +
    '    <div ng-if="paying" class="payLoadingBG">\n' +
    '        <div class="outside">\n' +
    '            <div class="confirm-content fade in">\n' +
    '                <div>\n' +
    '                    <span>支付中...</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="bar bar-footer bar-dark" >\n' +
    '        <div class="row-basket">\n' +
    '            <button  class="pull-right" ng-click="submitOrder()" ng-disabled="paying">\n' +
    '                <a class="btn-o-tobuy font16">确认支付</a>\n' +
    '            </button>\n' +
    '          \n' +
    '            <div class="media media-basket">\n' +
    '                <div class="media-left">\n' +
    '                    <div class="type2">\n' +
    '                        <span>实付款:</span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="media-body">\n' +
    '                    <div class="media-heading" ng-bind="\'￥\'+ order.total"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '  \n' +
    '</ion-view>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/order.html',
    '');
}]);
})();


(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/shop.html',
    '<ion-view class="itemList">\n' +
    '    <ion-header-bar align-title="center" class="bar-energized">\n' +
    '        <div class="title">\n' +
    '            <span class="container icon">\n' +
    '                <span ng-bind="$parent.currStore.name" class="storeName ng-binding"></span>\n' +
    '            </span>\n' +
    '        </div>\n' +
    '    </ion-header-bar>\n' +
    '    <ion-content delegate-handle="mainScroll" scroll-event-interval="800" on-scroll="swipe()" overflow-scroll="false">\n' +
    '        <div class="mainContent">\n' +
    '            <div class="list-content">\n' +
    '                <ul class="list">\n' +
    '                    <li class="xs-item1" ng-class="{\'item-divider\':item.name}" ng-repeat="item in totalItemList track by $index" ng-style="{true:{\'height\':\'{{item.height+\'px\'}}\'}}[item.empty]">\n' +
    '                        <span ng-if="item.name">{{::item.name}}</span>\n' +
    '                        <!--<img ng-if="!item.name && !item.empty" ng-src="{{::(imgRoot + item.scan)}}" ui-sref="commodity-detail({commodityId:item.commodityId})" />-->\n' +
    '                        <img ng-if="!item.name && !item.empty" ng-src="{{::(imgRoot + item.scan)}}" />\n' +
    '                        <div class="desc" ng-if="!item.name && !item.empty">\n' +
    '                            <p class="title">{{::item.commodityName}}</p>\n' +
    '                            <div>\n' +
    '                                <i class="icon-am" ng-if="item.mealId == 2 || item.mealId == 1"></i>\n' +
    '                                <i class="icon-mm" ng-if="item.mealId == 3 || item.mealId == 1"></i>\n' +
    '                                <i class="icon-pm" ng-if="item.mealId == 4 || item.mealId == 1"></i>\n' +
    '                            </div>\n' +
    '                            <div class="bottom">\n' +
    '                                <span class="txt-price">￥{{::item.promotion}}</span>\n' +
    '                                <div class="number">\n' +
    '                                <span class="minusCount">\n' +
    '                                    <div ng-show="item.count > 0" style="display: table">\n' +
    '                                        <span class="minus" ng-click="removeItem(item)"></span>\n' +
    '                                        <span class="count" ng-bind="item.count"></span>\n' +
    '                                    </div>\n' +
    '                                </span>\n' +
    '                                    <span class="plus" ng-click="addItem(item)"></span>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </ion-content>\n' +
    '    <div class="bar bar-footer bar-dark">\n' +
    '        <div class="row-basket">\n' +
    '            <div class="pull-right" ng-click="go(\'shoppingCart\')" style="pointer-events: auto;">\n' +
    '                <a class="btn-o-tobuy {{shoppingCartTotalPrice <= 0 ? \'btn-o-tobuy-none\' : \'font16\'}}" ng-bind="shoppingCartTotalPrice > 0 ? \'去结算\':\'选择任意餐品\'"></a>\n' +
    '            </div>\n' +
    '            <div class="media media-basket">\n' +
    '                <div class="media-left">\n' +
    '                    <img class="media-object" src="img/home/basket.png" ng-click="basketShow = basketShow ? !basketShow:true">\n' +
    '                    <div class="xs-badge">\n' +
    '                        <span class="badge" ng-bind="shoppingCartTotalNum"></span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="media-body">\n' +
    '                    <div class="media-heading" ng-bind="\'￥\' + (shoppingCartTotalPrice|number:2)"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</ion-view>');
}]);
})();

angular.module("xs1h").controller("orderCtrl", ["$scope", "$state", "$http", "$timeout", '$ionicModal', "$rootScope", "$ionicLoading", "$ionicPopup", "$ionicScrollDelegate", "$ionicBackdrop", "$stateParams", function($scope, $state, $http, $timeout, $ionicModal, $rootScope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicBackdrop, $stateParams) {

}]);
angular.module("xs1h").controller("orderPayCtrl", ["$scope", "$state", "$http", "$timeout", '$ionicModal', "$rootScope", "$ionicLoading", "$ionicPopup", "$ionicScrollDelegate", "$ionicBackdrop", "$stateParams", "$rootScope", function($scope, $state, $http, $timeout, $ionicModal, $rootScope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicBackdrop, $stateParams, $rootScope) {
    $http.post('order/findOrderByNumber', $stateParams).success(function(data) {
        if (data.statusCode == 0) {
            if(data.data){

            $scope.order = data.data;
            var commodityNumber = 0;
            var commodityList = $scope.order.commodityList;
            for (var i = 0; i < commodityList.length; i++) {
                commodityNumber += commodityList[i].totalNum;
            }
            $scope.order.commodityNumber = commodityNumber;
            }else{
                $scope.showComnPopup({message: "订单不存在!", type: "alert",alert:function function_name (argument) {
                location.href="index.html";
                }});
            }
        }else{
            alert("抱歉找不到该订单");
        }
    })

    $scope.quickPay = function() {
        if ($rootScope.wxReady) {
            $scope.submitOrder();
        } else {
            $timeout(function() {
                $scope.quickPay();
            }, 500);
        }
    }
    $scope.quickPay();
     function nopay(){
            $scope.paying = false;
        }
    $scope.submitOrder = function() {
        if($scope.paying) return;
        $scope.paying = true;
        $http.post("order/payOrderOnly", $stateParams).success(function(data) {
            if (0 == data.statusCode) {
                var config = angular.fromJson(data.data.payConfig);
                var orderCode=data.data.orderCode;
                config.success = function(res) {
                    $http.get("order/paySuccessScan?orderCode=" + orderCode).success(function(data) {
                        if (data.statusCode == 0){
                            if(!data.data.orderNumber){
                                alert(angular.toJson(data.data));
                            }
                            $state.go('paysuccess',{orderNumber:data.data.orderNumber});
                        }else{
                            alert(data.statusMessage);
                        }
                    });
                   nopay();
                };
                config.cancel = function(res) {
                    nopay();
                };
                config.fail=function (res) {
                    // bodyre 
                    alert(angular.toJson(res));
                     nopay();              
                }


                wx.chooseWXPay(config);
                   nopay();

            } else {
                $scope.paying = false;
            }
        })
    }


    $scope.showComnPopup = function (config) {
            if (config.type == "alert") {
                $ionicPopup.show({
                    title: "温馨提示",
                    scope: $scope,
                    cssClass: "comn-alert",
                    template: config.message,
                    buttons: [
                        {
                            text: "确定",
                            onTap: function (e) {
                                return true;
                            }
                        }
                    ]
                })
                    .then(function () {
                        if (config.alert) {
                            config.alert();
                        }
                    });
            }
            else if (config.type == "confirm") {
                $ionicPopup.show({
                    title: config.title,
                    scope: $scope,
                    cssClass: "comn-confirm",
                    buttons: [
                        {
                            text: "确定",
                            onTap: function (e) {
                                return true;
                            }
                        },
                        {
                            text: "取消",
                            onTap: function (e) {
                                return false;
                            }
                        }
                    ]
                })
                    .then(function (res) {
                        if (res) {
                            config.confirm();
                        }
                        else {
                            if (config.cancel) {
                                config.cancel();
                            }
                        }
                    });
            }
            else if (config.type == "toast") {
                $ionicLoading.show({
                    hideOnStateChange: true,
                    template: config.message || "",
                    noBackdrop: config.noBackdrop || true,
                    duration: config.duration || 1500
                });
            }
        };
}]);
angular.module("xs1h").controller("paySuccessCtrl",['$stateParams',"$scope", function($stateParams,$scope) {
   $scope.orderNumber=$stateParams.orderNumber;
}]);
angular.module("xs1h").controller("shopCtrl", ["$scope", "$state", "$http", "$timeout", '$ionicModal', "$rootScope", "$ionicLoading", "$ionicPopup", "$ionicScrollDelegate", "$ionicBackdrop", "$stateParams", function($scope, $state, $http, $timeout, $ionicModal, $rootScope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicBackdrop, $stateParams) {
		$http.post('order/findOrderByNumber',$stateParams).success(function (data) {
		})
}]);
angular.module('xs1h').factory('timestampMarker', [ function() {
    var timestampMarker = {
        request: function(config) {
            var headersGetter = arguments[0].headers;
            if ((headersGetter["Accept"] && headersGetter["Accept"].split(",")[0]) == "application/json"&&config["url"].indexOf("template")<0) {
                config.url = httpBase + config.url;
                // config.headers = {"content-Type":"application/json"};
            }
            return config;
        },
        response: function(response) {
            return response;
        }
    };
    return timestampMarker;
}])