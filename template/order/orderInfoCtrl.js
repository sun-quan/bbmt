/**
 * Created by cjd on 2015/12/24.
 */
angular.module("xsyh").controller("orderInfoCtrl", ["$scope", "$http", "$stateParams", "$filter", function ($scope, $http, $stateParams, $filter) {
    $scope.config = {distributionTime: {}, store: {}};//存储配置信息
    $scope.initOrderInfo = function () {
        $scope.$parent.storeList.forEach(function (store) {
            $scope.config.store[store.storeId] = store;
        });
        $scope.$parent.timeList.forEach(function (time) {
            $scope.config.distributionTime[time.value] = time;
        });
        if ($stateParams.orderInfo) {
            $scope.orderInfo = $stateParams.orderInfo;
            if ($scope.orderInfo.distributionTime) {
                $scope.orderInfo.displayTime = $filter("date")($scope.orderInfo.distributionDate, "yyyy-MM-dd") + " " + $scope.config.distributionTime[$scope.orderInfo.distributionTime].valueName;
            }
            if ($scope.orderInfo.storeId) {
                $scope.orderInfo.storeName = $scope.config.store[$scope.orderInfo.storeId].name;
            }
        }
        if (!$stateParams.orderInfo && $stateParams.orderId) {
            $http.post("order/findByOrderId", {orderId: $stateParams.orderId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.orderInfo = data.data;
                    if ($scope.orderInfo.distributionTime) {
                        $scope.orderInfo.displayTime = $filter("date")($scope.orderInfo.distributionDate, "yyyy-MM-dd") + " " + $scope.config.distributionTime[$scope.orderInfo.distributionTime].valueName;
                    }
                    if ($scope.orderInfo.storeId) {
                        $scope.orderInfo.storeName = $scope.config.store[$scope.orderInfo.storeId].name;
                    }
                }
            });
        }
    };
    if ($scope.$parent.storeList && $scope.$parent.storeList.length > 0) {
        $scope.initOrderInfo();
    }

    $scope.$on("initOrderInfo", function (event) {
        $scope.initOrderInfo();
    });
    $scope.pay = function (orderInfo) {// 支付
        if ($scope.paying) return;
        $scope.paying = true;
        if ($stateParams.from == "posScan") {
            $http.post("order/payOrderOnly", {
                storeId: orderInfo.storeId,
                orderNumber: orderInfo.orderNumber
            }).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    var config = angular.fromJson(data.data.payConfig);
                    config.success = function (res) {
                        $http.get("/order/paySuccessScan?orderCode=" + orderInfo.orderCode).success(function (data, status, headers, config) {
                            if (data.statusCode == 0) {
                                $scope.paying = false;
                                $scope.showComnPopup({message: "订单已支付", type: "alert"});
                                $scope.go("home");
                            }
                        });
                    };
                    config.cancel = function (res) {//取消函数
                        $scope.showComnPopup({message: "支付已取消", type: "toast"});
                        $scope.paying = false;
                    };
                    wx.chooseWXPay(config);
                }
                else {
                    alert(data.statusMessage);
                    $scope.paying = false;
                }
            });
        }
        else {
            $http.post("order/payOrder", {orderId: orderInfo.orderId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    var config = angular.fromJson(data.data);
                    config.success = function (res) {
                        $http.get("/order/getUUID?prePay_Id=" + config.package.substring(10)).success(function (data, status, headers, config) {
                            if (data.statusCode == 0) {
                                $scope.paying = false;
                                $scope.showComnPopup({message: "订单已支付", type: "toast"});
                                $scope.go("order", {orderType: "nopay"});
                            }
                        });
                    };
                    config.cancel = function (res) {//取消函数
                        $scope.showComnPopup({message: "支付已取消", type: "toast"});
                        $scope.paying = false;
                    };
                    wx.chooseWXPay(config);
                }
                else {
                    alert(data.statusMessage);
                    $scope.paying = false;
                }
            });
        }
    };
}]);