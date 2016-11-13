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