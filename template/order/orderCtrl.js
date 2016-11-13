/**
 * Created by cjd on 2015/12/22.
 */
angular.module("xsyh").controller("orderCtrl", ["$scope", "$http", "$stateParams","$ionicPopup","$ionicScrollDelegate","$ionicLoading", function ($scope, $http, $stateParams,$ionicPopup,$ionicScrollDelegate,$ionicLoading) {
    $scope.orderType = $stateParams.orderType || "nopay";
    $scope.config = {distributionTime: {}, store: {}};//存储配置信息
    $scope.totalOrderList = {
        /*
         * items 订单列表
         * pageIndex 当前获取的页数
         * pageCach 页面是否已缓存完毕
         * time 是否在刷新中
         * logisticsStates 物流状态
         * */
        "nopay": {
            orderList: [],
            pageIndex: 0,
            count: 0,
            orderStates: 10,
            url: "order/getMyUnpaidOrder"
        },
        "wait": {
            orderList: [],
            pageIndex: 0,
            orderStates: 30,
            url: "order/getMyPickOrder",
            count: 0
        },
        "over": {
            orderList: [],
            pageIndex: 0,
            count: 0,
            orderStates: 40,
            url: "order/getMyFinishedOrder"
        },
        "cancel": {
            orderList: [],
            pageIndex: 0,
            count: 0,
            orderStates: 60,
            url: "order/getMyCancelOrder"
        }
    };
    $scope.Fn = {};
    $scope.Fn.getData = function (orderType) {
        $ionicLoading.show({
            hideOnStateChange: true,
            template: "数据加载中...",
            noBackdrop: false
        });
        $http.post($scope.totalOrderList[orderType].url, {pageIndex: 0, pageSize: 0}).success(function (data) {
            $ionicLoading.hide();
            if (data.statusCode == 0) {
                $scope.orderType = orderType;
                $scope.totalOrderList[orderType].orderList = data.data;
                $scope.totalOrderList[orderType].orderList.forEach(function(order){
                    if($scope.config.store[order.storeId] && $scope.config.store[order.storeId].name){
                        order.storeName = $scope.config.store[order.storeId].name;
                    }
                    if($scope.config.distributionTime[order.distributionTime] && $scope.config.distributionTime[order.distributionTime].valueName){
                        order.displayTime = order.distributionDate + " " + $scope.config.distributionTime[order.distributionTime].valueName;
                    }
                    order.commodityCount = 0;
                    order.commodityList.forEach(function(commodity){
                        order.commodityCount += commodity.totalNum;
                    });
                });
                $scope.mainScroll.scrollTop();
            } else {
                alert(data.statusMessage);
            }
        });
    };
    $scope.Fn.pay = function (orderInfo) {// 支付
        if ($scope.paying) return;
        $scope.showComnPopup({message: "支付中...", type: "toast"});
        $scope.paying = true;
        $http.post("order/payOrder", {orderId: orderInfo.orderId}).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                var config = angular.fromJson(data.data);
                config.success = function (res) {
                    $http.get("/order/getUUID?prePay_Id=" + config.package.substring(10)).success(function (data, status, headers, config) {
                        if (data.statusCode == 0) {
                            $scope.paying = false;
                            $scope.showComnPopup({message: "订单已支付", type: "toast"});
                            $scope.totalOrderList["nopay"].orderList.splice($scope.totalOrderList["nopay"].orderList.indexOf(orderInfo), 1);
                            $scope.go("order-detail", {
                                orderInfo: data.data,
                                orderId: data.data.orderId,
                                from: "order"
                            });
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
            }
        });
    };
    $scope.Fn.cancelOrder = function (orderInfo) {
        var config = {title: "是否确认取消订单?", type: "confirm"};
        config.confirm = function(){
            $http.post("/order/cancel", {orderId: orderInfo.orderId}).success(function (data) {
                if (data.statusCode == 0) {
                    $scope.showComnPopup({message: "订单取消成功", type: "toast"});
                    $scope.totalOrderList["nopay"].orderList.splice($scope.totalOrderList["nopay"].orderList.indexOf(orderInfo), 1);
                }
            });
        };
        $scope.showComnPopup(config);
    };

    $scope.Fn.stateChange = function (orderType) {
        $scope.Fn.getData(orderType);
    };
    $scope.initOrder = function(){
        $scope.$parent.storeList.forEach(function (store) {
            $scope.config.store[store.storeId] = store;
        });
        $scope.$parent.timeList.forEach(function (time) {
            $scope.config.distributionTime[time.value] = time;
        });
        $scope.mainScroll = $ionicScrollDelegate.$getByHandle("mainScroll");
        $scope.Fn.stateChange($scope.orderType);
    };
    $scope.$on("initOrder", function (event) {
        $scope.initOrder();
    });
    if ($scope.$parent.storeList && $scope.$parent.storeList.length > 0) {
        $scope.initOrder();
    }
}]);