/**
 * xs1h Module
 *
 * Description
 */
(function() {
    "use strict";
    var basehttp = "";
    // var basehttp = "http://scandev.xs1h.com/";
    // var basehttp = "http://  172.17.10.254:8080/"
    angular.module('buygifts', ['ionic']).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.when('', '/main');
        $stateProvider.state('main', {
            url: "/orderpay",
            templateUrl: "buygifts/template/index.html",
            controller: "mainCtrl"
        }).state('order', {
            url: "/order",
            templateUrl: "buygifts/template/order.html",
            controller: "orderCtrl"
        }).state('paysuccess', {
            url: "/paysuccess?orderNumber",
            templateUrl: "metro/template/pay-success.html",
            controller: "paySuccessCtrl"
        });
        //$locationProvider.html5Mode(true);
        //$ionicConfigProvider.views.swipeBackEnabled(false);
        //$ionicConfigProvider.scrolling.jsScrolling(false);
        // $httpProvider.interceptors.push('timestampMarker');
    }]).run(["$http", function($http) {
        var wxCheckSignHost = location.href.split("#")[0];
        $http.post(basehttp + "/index/getWeChatJsSign?url=" + wxCheckSignHost, {
            url: wxCheckSignHost
        }).success(function(data, status, headers, config) {
            if (data.statusCode == 0) {
                wx.config(angular.fromJson(data.data));
                wx.ready();
            }
        });
    }]).controller("paySuccessCtrl", ['$stateParams', "$scope", function($stateParams, $scope) {
        $scope.orderNumber = $stateParams.orderNumber;
    }]).controller('mainCtrl', ['$scope', '$http', '$location', '$ionicLoading', "$ionicModal", "$filter", "$ionicPopup", "$timeout", "$state","$ionicScrollDelegate", function($scope, $http, $location, $ionicLoading, $ionicModal, $filter, $ionicPopup, $timeout, $state,$ionicScrollDelegate) {
        var activityId = $location.search().id; //活动id
        var distributionTime = 60;
        var distributionDate = $filter("date")(new Date(), "yyyy.MM.dd");
        // $state.go('paysuccess');
        $scope.showpage = false;
        $http.post(basehttp + "activities/find", { //获取活动数据
            activityId: activityId
        }).success(function(res) {
            if (res.statusCode === "0") {
                if (res.data.count > 0) {
                    $scope.showComnPopup({
                        message: "您已参加过此活动，欢迎下周再来",
                        type: "alert",
                        alert: function() {
                            location.href = "/index/indexpage?type=1";
                        }
                    });
                    return;
                }
                var i, time, key;
                $scope.showpage = true;
                var data = res.data;
                var showList = data;
                /*处理时间 */
                var times = data.times;
                var temTimeMap = {};
                var timeKeys = [];
                for (i = 0; i < times.length; i += 1) {
                    time = times[i];
                    key = time.valueName.split("-")[0].split(":").join("");
                    temTimeMap[key] = time;
                    timeKeys.push(key);
                }
                timeKeys = timeKeys.sort(function(a, b) {
                    return +a - +b;
                });
                var nowTime = (new Date()).valueOf();
                var nowSecond = $filter("date")(nowTime, "HH:mm:ss");
                nowSecond = nowSecond.split(":");
                if (nowSecond[1] >= 30) {
                    nowSecond[0] += 1;
                    nowSecond[1] = 0;
                } else {
                    nowSecond[1] = 30;
                }
                nowSecond = nowSecond[0] + nowSecond[1];
                if (temTimeMap[nowSecond]) {
                    distributionTime = temTimeMap[nowSecond].value;
                } else if (nowSecond > timeKeys[timeKeys.length - 1]) {
                    distributionDate = $filter("date")(nowTime + 24 * 60 * 60 * 1000, "yyyy.MM.dd")
                } else {
                    distributionTime = temTimeMap[1000].value;
                }
                showList.count = 0;
                showList.price = 0;
                showList.content = angular.fromJson(data.activity.content);
                var districtStoreList = showList.districtStoreList;
                var stores = showList.store;
                var x, nowDistrict, y, nowStore;
                for (x in districtStoreList) {
                    nowDistrict = districtStoreList[x];
                    for (y in stores) {
                        nowStore = stores[y];
                        if (nowStore.district == nowDistrict.districtCode) {
                            if (!showList.nowDistrict) {
                                showList.nowDistrict = x;
                            }
                            if (!nowDistrict.data) {
                                nowDistrict.data = [];
                            }
                            nowDistrict.data.push(nowStore);
                        }
                    }
                }
                $scope.showList = showList;
            } else {
                $scope.showComnPopup({
                    message: res.statusMessage,
                    type: "alert",
                    alert: function() {
                        location.href = "/index/indexpage?type=1";
                    }
                });
            }
        });
        $ionicModal.fromTemplateUrl('buygifts/template/shopselect.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.addItem = function(item, index) {
            item.count = (item.count || 0) + index;
            if (item.count < 0) {
                item.count = 0;
                return;
            }
            $scope.showList.count += index;
            $scope.showList.price += item.promotion * index;
        };
        $scope.submitOrder = function() {
            if ($scope.showList.count <= 0) {
                return;
            }
            $scope.modal.show();
        };
        $scope.leftSelect = function(key) {
            $scope.showList.nowDistrict = key;
                $ionicScrollDelegate.$getByHandle('right').scrollTop();

        }
        $scope.stateGo = function(url, obj) {
            alert(angular.toJSON([url, obj]));
            $state.go(url, obj);
        };
        $scope.orderPay = function(id) {
            if ($scope.paying && goodslist.length > 0) {
                return;
            }
            $scope.showComnPopup({
                message: "支付中...",
                type: "toast"
            });
            $scope.paying = true;
            var submitOrder = {
                orderType: 1, //订单类型
                storeId: id, //门店ID
                takeType: 1, //取餐方式
                distributionDate: distributionDate, //取餐日期
                distributionTime: distributionTime, //取餐时间
                orderInfoVoList: []
            };
            var goodslist = angular.copy($scope.showList.commodities),
                i;
            for (i = 0; i < goodslist.length; i++) {
                if (goodslist[i].count > 0) {
                    submitOrder.orderInfoVoList.push({
                        commodityNum: goodslist[i].count,
                        commodityId: goodslist[i].commodityId
                    });
                }
            }
            submitOrder.orderInfoVoList.push({
                commodityNum: 1,
                commodityId: $scope.showList.gift.value
            })
            $http.post(basehttp + "order/createOrder", submitOrder, {
                headers: {
                    'gift': $scope.showList.gift.value
                }
            }).success(function(data, status, headers, config) {
                if (data.statusCode == 0) { /*正常订单走微信支付*/
                    var config = angular.fromJson(data.data.payConfig);
                    config.success = function(res) {
                        var parms = {
                            type: "prePay_Id",
                            data: data.data.prePay_Id
                        };
                        $http.get(basehttp + "order/getUUID?prePay_Id=" + config.package.substring(10)).success(function(data, status, headers, config) {
                            if (data.statusCode == 0) {
                                $scope.paying = false;
                                $scope.showComnPopup({
                                    message: "订单已支付",
                                    type: "toast"
                                });
                                $scope.modal.hide();
                                location.href = 'metro.html#/paysuccess?orderNumber=' + data.data.orderNumber;
                            }
                        });
                    };
                    config.fail = function(res) {
                        $timeout(function() {
                            $scope.showComnPopup({
                                message: "网络繁忙,请重试!",
                                type: "alert"
                            });
                            $scope.paying = false;
                        }, 0);
                    };
                    config.cancel = function(res) {
                        /*发请求取消订单*/
                        $timeout(function() {
                            $scope.paying = false;
                            var parms = {};
                            if (data.data.orderId && data.data.orderId.length > 0) {
                                parms.orderId = data.data.orderId;
                            }
                            if (data.data.prePay_Id && data.data.prePay_Id.length > 0) {
                                parms.prePay_Id = data.data.prePay_Id;
                            }
                            $http.post("/order/cancel", parms);
                        }, 0);
                    };
                    wx.chooseWXPay(config);
                } else if (data.statusCode == 1) { /*0元支付订单*/
                    var parms = {
                        type: "orderCode",
                        data: data.data.orderCode
                    };
                    $scope.getOrderInfo(parms);
                } else if (data.statusCode == -1) {
                    $scope.showComnPopup({
                        message: "您已参加过此活动，欢迎下周再来",
                        type: "alert",
                        alert: function() {
                            location.href = "index.html";
                        }
                    })
                    $scope.paying = false;
                } else {
                    $scope.showComnPopup({
                        message: data.statusMessage,
                        type: "alert"
                    });
                    $scope.paying = false;
                }
            }).error(function(data, status, headers, config) {
                if (status == 0) {
                    $scope.showComnPopup({
                        message: "当前网络异常,请重试!",
                        type: "alert",
                        alert: function() {
                            $scope.paying = false;
                        }
                    });
                } else {
                    $scope.showComnPopup({
                        message: "errorStatus:" + status + " errorData:" + angular.toJson(data),
                        type: "alert"
                    });
                    $scope.paying = false;
                }
            });
        };
        $scope.showComnPopup = function(config) {
            if (config.type === "alert") {
                $ionicPopup.show({
                    title: "温馨提示",
                    scope: $scope,
                    cssClass: "comn-alert",
                    template: config.message,
                    buttons: [{
                        text: "确定",
                        onTap: function() {
                            return true;
                        }
                    }]
                }).then(function() {
                    if (config.alert) {
                        config.alert();
                    }
                });
            } else if (config.type == "confirm") {
                $ionicPopup.show({
                    title: config.title,
                    scope: $scope,
                    cssClass: "comn-confirm",
                    buttons: [{
                        text: "确定",
                        onTap: function() {
                            return true;
                        }
                    }, {
                        text: "取消",
                        onTap: function() {
                            return false;
                        }
                    }]
                }).then(function(res) {
                    if (res) {
                        config.confirm();
                    } else {
                        if (config.cancel) {
                            config.cancel();
                        }
                    }
                });
            } else if (config.type === "toast") {
                $ionicLoading.show({
                    hideOnStateChange: true,
                    template: config.message || "",
                    noBackdrop: config.noBackdrop || true,
                    duration: config.duration || 1500
                });
            }
        };
    }]).run(['$templateCache', function($templateCache) {
        $templateCache.put('template/pay-success.html', '<ion-view class="pay">\n' + '    <ion-header-bar align-title="center" class="bar-energized">\n' + '<!--         <a class="btn-back" ng-click="go(-1)"></a>\n' + ' -->        <h1 class="title">预定成功</h1>\n' + '    </ion-header-bar>\n' + '<div class="pay-success">\n' + '   <img src="metro/static/img/pay-success.png" style="width:100%" />\n' + '     <div class="order-number" >\n' + '                <div class="title">取餐号:</div>\n' + '                <div class="orderNumber">\n' + '                    <span>{{orderNumber}}</span>\n' + '                </div>\n' + '                <div class="tips">到店后出示上方号码，提取您的餐品</div>\n' + '            </div>\n' + '   <a href="index.html" class="xs-btn">去首页逛逛</a>\n' + '</div>\n' + '   </ion-view>');
    }]);
})();