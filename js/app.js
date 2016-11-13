/**
 * Created by jiecao on 15/6/25.
 */
var xsyh = angular.module("xsyh", ["ionic"])
    .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$ionicConfigProvider", "$compileProvider", "$animateProvider", function ($stateProvider, $urlRouterProvider, $locationProvider, $ionicConfigProvider, $compileProvider, $animateProvider) {
        $urlRouterProvider
            .when("", "/home");
        $stateProvider
            .state("home", {
                url: "/home",
                views: {
                    "mainContent": {
                        templateUrl: "template/home/home.html?tk=" + new Date().getTime(),
                        controller: "homeCtrl"
                    }
                }
            })
            .state("shoppingCart", {
                url: "/shoppingCart",
                views: {
                    "mainContent": {
                        templateUrl: "template/shoppingCart/shoppingCart.html?tk=" + new Date().getTime(),
                        controller: "shoppingCartCtrl"
                    }
                }
            })
            .state("pay", {
                url: "/pay?from",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "template/pay/pay.html?tk=" + new Date().getTime(),
                        controller: "payCtrl"
                    }
                }
            })
            .state("list", {
                url: "/list?from&storeId",
                views: {
                    "mainContent": {
                        templateUrl: "template/list/list.html?tk=" + new Date().getTime(),
                        controller: "listCtrl"
                    }
                }
            })
            .state("my", {
                url: "/my",
                views: {
                    "mainContent": {
                        templateUrl: "template/my/my.html?tk=" + new Date().getTime(),
                        controller: "myCtrl"
                    }
                }
            })
            .state("coupons", {
                url: "/coupons?from",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "template/coupons/coupons.html?tk=" + new Date().getTime(),
                        controller: "couponsCtrl"
                    }
                }
            })
            .state("commodity-detail", {
                url: "/commodityDetail?commodityId",
                views: {
                    "mainContent": {
                        templateUrl: "template/commodity/detail.html?tk=" + new Date().getTime(),
                        controller: "detailCtrl"
                    }
                }
            })
            .state("order", {
                url: "/order?orderType",
                views: {
                    "mainContent": {
                        templateUrl: "template/order/order.html?tk=" + new Date().getTime(),
                        controller: "orderCtrl"
                    }
                }
            })
            .state("order-detail", {
                url: "/order/detail?orderId",
                cache: false,
                params: {orderInfo: null,from:null},
                views: {
                    "mainContent": {
                        templateUrl: "template/order/orderInfo.html?tk=" + new Date().getTime(),
                        controller: "orderInfoCtrl"
                    }
                }
            })
            .state("commodityGroup", {
                url: "/commodityGroup?activityId",
                views: {
                    "mainContent": {
                        templateUrl: "template/commodityGroup/commodityGroup.html?tk=" + new Date().getTime(),
                        controller: "commodityGroupCtrl"
                    }
                }
            })
            .state("groupInfo", {
                url: "/groupInfo?groupMealId",
                views: {
                    "mainContent": {
                        templateUrl: "template/groupInfo/groupInfo.html?tk=" + new Date().getTime(),
                        controller: "groupInfoCtrl"
                    }
                }
            })
            .state("address", {
                url: "/address?from",
                views: {
                    "mainContent": {
                        templateUrl: "template/address/address.html?tk=" + new Date().getTime(),
                        controller: "addressCtrl"
                    }
                }
            })
            .state("FAQ", {
                url: "/FAQ",
                views: {
                    "mainContent": {
                        templateUrl: "template/FAQ/FAQ.html?tk=" + new Date().getTime()
                    }
                }
            })
            .state("posScan", {
                url: "/posScan?orderNumber&storeId",
                views: {
                    "mainContent": {
                        templateUrl: "template/posScan/posScan.html?tk=" + new Date().getTime(),
                        controller: "posScanCtrl"
                    }
                }
            })
            .state("activity", {
                url: "/activity?activityId",
                views: {
                    "mainContent": {
                        templateUrl: "template/activity/activity.html?tk=" + new Date().getTime(),
                        controller: "activityCtrl"
                    }
                }
            });
        //$locationProvider.html5Mode(true);
        //$ionicConfigProvider.views.swipeBackEnabled(false);
        $animateProvider.classNameFilter(/^((?!(repeat-modify)).)*$/);
        $compileProvider.debugInfoEnabled(false);
        $ionicConfigProvider.views.transition("none");
        //$ionicConfigProvider.scrolling.jsScrolling(false);
    }])
    .controller("mainCtrl", ["$scope", "$state", "$http", "$timeout", '$ionicModal', "$rootScope", "$ionicLoading", "$ionicPopup", "$ionicScrollDelegate", "$ionicBackdrop", "$stateParams","$q", function ($scope, $state, $http, $timeout, $ionicModal, $rootScope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicBackdrop, $stateParams,$q) {
        $scope.wxCheckSignHost = location.href.split("#")[0];
        $scope.imgRoot = "";
        $scope.shoppingCart = [];//购物车商品
        $scope.shoppingCartTotalNum = 0;
        $scope.shoppingCartTotalPrice = 0;
        $scope.currItem = {};//当前操作商品
        $scope.currStore = {};//当前门店
        $scope.userInfo = {};
        $scope.order = {"takeType": 1};//订单对象
        $scope.orderType = 1;
        $scope.selectedDistribution = {};
        $scope.alertMsg = "";
        $scope.exchangeDate = "";
        $scope.exchangeTime = "";
        $scope.mealInfoList = [];//早中晚餐
        $scope.categoryList = [];//包子馒头饮品其他
        $scope.totalCommodityList = [];//全部商品
        $scope.dateList = [];
        $scope.timeList = [];
        $scope.currFooterMenu = 0;
        $scope.currCoupons = {};
        $scope.currBusiness = {};
        $scope.currAddress = {};
        $scope.itemHeight = 90;//列表页商品高度
        $scope.itemTabHeight = 30;//列表页商品Tab高度
        $scope.storeListScroll = null;
        $scope.activityInfo = {};
        $scope.shareToPromiseList = [];
        var shopCartEleCR = null;
        var flyEle = null;
        var payError = 0, configError = 0;

        //根据参数切换到指定的状态
        $scope.go = function (state, Params) {
            if (angular.isNumber(state)) {
                history.back(state);
            }
            else {
                if (!$state.is("home") && !$state.is("my") && (state == "shoppingCart" || state == "pay") && $scope.shoppingCartTotalPrice <= 0) {
                    return;
                }
                $state.go(state, Params || {});
            }
        };

        /*检测当前状态*/
        $scope.stateEqual = function (stateName) {
            eval("var reg = \/^#\\\/" + stateName.replace("/", "\\\/") + "(?=\\?|$)\/");
            return reg.test(location.hash)
        };

        /*关闭分享遮罩*/
        $scope.closeMask = function () {
            $scope.activityInfo.showShareMask = false;
        };

        /*自定义滚动组件测试 BEG*/
        /*
         * 初始化组件
         * */
        $scope.initMutilScrollPopup = function () {
            if (!$scope.activeIndexList) {
                return;
            }
            $scope.activeIndexList.forEach(function (itemIndex, index) {
                /*
                 * 遍历dataSource深度,重新载入数据源
                 * */
                if (index != $scope.scrollSource.length - 1) {
                    $scope.scrollSource = [];
                    $scope.scrollSource.push($scope.dataSource);
                    var _hasChildren = true;
                    while (_hasChildren) {
                        if ($scope.scrollSource.slice(-1)[0][itemIndex].list && $scope.scrollSource.slice(-1)[0][itemIndex].list.length > 0) {
                            $scope.scrollSource.push($scope.scrollSource.slice(-1)[0][itemIndex].list);
                        }
                        else {
                            _hasChildren = false;
                        }
                    }
                }
                /*
                 * 设置当前选中项样式
                 * */
                $scope.scrollSource[index].forEach(function (item, index2) {
                    if (index2 == itemIndex) {
                        item.selected = true;
                    }
                    else {
                        item.selected = false;
                    }
                });
                /*滚动到选中项位置*/
                $timeout(function () {
                    $ionicScrollDelegate.$getByHandle("scroll" + index).scrollTo(null, 40 * itemIndex, true);
                }, 50);
            })
        };
        /*监听选中项索引数组*/
        $scope.$watch("activeIndexList", function () {
            $scope.initMutilScrollPopup();
        }, true);

        /*
         * scrollIndex:当前scroller组件索引,index:当前选中项索引
         **/
        $scope.changeActiveIndex = function (scrollIndex,index) {
            $scope.activeIndexList[scrollIndex] = index;
            /*
             * 判断当前scroller组件索引是否为最后一个,是:不改变后续scroller组件内选中项索引,否:将后续scroller组件内选中项索引置为0
             * */
            if (scrollIndex != $scope.activeIndexList.length - 1) {
                $scope.activeIndexList.forEach(function (item, index, array) {
                    if (index > scrollIndex) {
                        array[index] = 0;
                    }
                });
            }
        };
        $scope.closeMutilScrollPopup = function () {
            $ionicBackdrop.release();
            $scope.showMutilScroll = false;
        };
        $scope.showMutilScrollPopup = function (config) {
            $scope.scrollSource = [];
            $scope.activeIndexList = [];
            $scope.success = config.success;
            /*格式化,将value转换成index*/
            $scope.dataSource = config.dataSource;
            $scope.dataSource.forEach(function (item, index) {
                if (item.value == config.activeIndexList[0]) {
                    $scope.activeIndexList.push(index);
                    item.list.forEach(function (childItem, childIndex) {
                        if (childItem.value == config.activeIndexList[1]) {
                            $scope.activeIndexList.push(childIndex);
                        }
                    })
                }
            });
            if ($scope.activeIndexList.length == 0) {
                $scope.showComnPopup({message: "默认值为空!", type: "toast"});
                return;
            }
            $ionicBackdrop.retain();
            $scope.showMutilScroll = true;
            $scope.initMutilScrollPopup();
        };
        $scope.MutilScrollPopupConfirm = function () {
            /*格式化,将index转换成obj*/
            var retList = [];
            $scope.activeIndexList.forEach(function (itemIndex, index) {
                retList.push($scope.scrollSource[index][itemIndex]);
            });
            $scope.closeMutilScrollPopup();
            $scope.success(retList);
        };
        /*自定义滚动组件测试 END*/

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (fromState.name == "home" && toState.name == "order-detail") {
                event.preventDefault();
            }
            if (toState.name == "shoppingCart") {
                /*初始化购物车数据源*/
                $scope.initCart();
                /*当选中的商品餐别一致时跳过购物车页面直接转向结算页面*/
                var mealCount = 0;
                $scope.mealInfoList.forEach(function (mealInfo) {
                    if (mealInfo.itemList.length > 0) {
                        mealCount++
                    }
                });
                if (mealCount == 1 && fromState.name != "home") {
                    event.preventDefault();
                    $scope.go("pay");
                }
            }
            if (fromState.name == "order-detail") {
                $scope.categoryList.forEach(function (item) {
                    item.itemList = [];
                });
                $scope.currCoupons = {};
                $scope.currBusiness = {};
                $scope.currUserAddress = {};
                if ($scope.shoppingCart.length > 0) {
                    $scope.shoppingCart.forEach(function (item) {
                        delete item.count;
                    });
                    $scope.shoppingCart = [];
                    $scope.shoppingCartTotalNum = 0;
                    $scope.shoppingCartTotalPrice = 0;
                }
                if (toState.name == "pay") {
                    event.preventDefault();
                    $scope.go("home");
                }
            }
        });

        $scope.enter = function (state, index) {
            $scope.currFooterMenu = index;
            if (state == "order") {
                $state.go(state, {orderType: "nopay"});
            }
            else {
                $scope.go(state);
            }
        };

        $ionicModal.fromTemplateUrl("storeAddress.html", {
            scope: $scope,
            animation: "slide-in-left"
        }).then(function (modal) {
            $scope.addressModal = modal;
        });

        /*定位*/
        $scope.getCurrentPosition = function () {
            /*微信定位*/
            //var getLocationConfig = {
            //    type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            //    success: function (res) {
            //        $scope.showComnPopup({message: "获取位置信息成功!", type: "toast"});
            //        $scope.getNearbyStore(res);
            //    },
            //    cancel: function (res) {//取消函数
            //        $scope.showNearbyStore = false;
            //        $scope.showComnPopup({message: "用户拒绝授予位置信息!", type: "toast"});
            //        $scope.addressModal.show();
            //        if (!$scope.currDistrictIndex) {
            //            $scope.currDistrictIndex = 0;
            //        }
            //    },
            //    fail: function (res) {
            //        $scope.showNearbyStore = false;
            //        $scope.showComnPopup({message: "获取位置信息失败!", type: "toast"});
            //        $scope.addressModal.show();
            //        if (!$scope.currDistrictIndex) {
            //            $scope.currDistrictIndex = 0;
            //        }
            //    }
            //};
            //wx.getLocation(getLocationConfig);
            /*HTML5定位*/
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.getNearbyStore(position.coords);
            }, function (error) {
                if (error.code == 1) {
                    $scope.showComnPopup({message: "用户拒绝授予位置信息,请手动选择门店!", type: "toast"});
                }
                else if (error.code == 2) {
                    $scope.showComnPopup({message: "定位失败,请手动选择门店!", type: "toast"});
                }
                else if (error.code == 3) {
                    $scope.showComnPopup({message: "获取用户位置超时!", type: "toast"});
                }
                $scope.showNearbyStore = false;
                $scope.addressModal.show();
                if (!$scope.currDistrictIndex) {
                    $scope.currDistrictIndex = 0;
                }
            }, {timeout: 5000, maximumAge: 60000});
        };

        $scope.getNearbyStore = function (lbs) {
            $http.post("/store/nearby", {
                lat: lbs.latitude,
                lng: lbs.longitude
            }).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.nearbyStoreList = [];
                    data.data.forEach(function(item){
                        $scope.storeList.forEach(function(store){
                            if(item.storeId == store.storeId){
                                store.distance = item.distance;
                                $scope.nearbyStoreList.push(store);
                            }
                        });
                    });
                    $scope.showNearbyStore = $scope.nearbyStoreList.length > 0;
                    $scope.addressModal.show();
                    if(!$scope.currDistrictIndex){
                        $scope.currDistrictIndex = 0;
                    }
                }
                else {
                    $scope.showComnPopup({message: data.statusMessage, type: "alert"});
                }
            })
        };

        $scope.openAddressModal = function () {
            $scope.getCurrentPosition();
        };
        $scope.closeAddressModal = function (item) {
            $scope.currStore = item;
            $scope.refreshView();
            $scope.addressModal.hide();
        };
        $scope.changeStoreList = function(index){
            $scope.currDistrictIndex = index;
            $scope.storeKey = "";
            if(!$scope.storeListScroll){
                $scope.storeListScroll = $ionicScrollDelegate.$getByHandle("storeListScroll");
            }
            if($scope.storeListScroll){
                $scope.storeListScroll.scrollTop(true);
            }
        };

        $scope.getConfig = function () {
            $http.post("/index/getConfig", {lon: 0,lat: 0}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.imgRoot = data.data.adminUrl;
                    $scope.categoryListBak = data.data.categoryList;
                    $scope.mealInfoList = data.data.mealInfoList;
                    $scope.dateList = data.data.orderDateResponseItemList;
                    $scope.timeList = data.data.timeList;

                    if(data.data.memberInfo){
                        $scope.userInfo = data.data.memberInfo;
                        if($scope.userInfo.contacts){
                            $scope.order.cellPhone = data.data.memberInfo.contacts;
                        }
                    }

                    $scope.storeList = data.data.storeList;
                    /*获取区县门店List*/
                    $scope.districtStoreList = data.data.districtStoreList;
                    $scope.districtStoreList.forEach(function(district){
                        district.count = district.storeIdList.length;
                        district.storeList = [];
                        district.storeIdList.forEach(function(storeId){
                            $scope.storeList.forEach(function(store){
                                if(storeId == store.storeId){
                                    district.storeList.push(store);
                                }
                            });
                        });
                    });
                    $scope.districtStoreList.sort(function(a,b){
                        return -(a.count - b.count)
                    });
                    /*如果存在门店配送默认地址，将默认地址存放到对应的门店对象中*/
                    if(data.data.defaultAddress){
                        $scope.storeList.forEach(function(item){
                            if(item.storeAddressList.some(function(storeAddress){
                                    return(storeAddress.addressId == data.data.defaultAddress.storeAddressId)
                                })){
                                item.defaultAddress = data.data.defaultAddress;
                            }
                        });
                    }

                    /*hook
                     * 如果URL指定了门店ID,手动设置默认门店
                     * */
                    if (location.hash.indexOf("storeId") >= 0) {
                        data.data.commodityOrder = {};
                        data.data.commodityOrder.storeId = location.hash.replace(/.*[\?|\&]storeId\=([^\&]*)\&?.*/, "$1");
                    }
                    if(data.data.commodityOrder && data.data.commodityOrder.storeId){/*hook,如果上次订餐门店已下线,则重新选择门店*/
                        $scope.currStore = $scope.storeList.filter(function (item, index, array) {
                            return (item.storeId == data.data.commodityOrder.storeId && item.online == 1)
                        })[0];
                        if(!$scope.currStore){
                            data.data.commodityOrder = null;
                        }
                    }
                    if (data.data.commodityOrder && data.data.commodityOrder.storeId) {
                        $http.post("/goods/getNewCommodityList", {
                            storeId: $scope.currStore.storeId,
                            pageSize: 0
                        }).success(function (data, status, headers, config) {
                            if(data.statusCode == 0){
                                $scope.totalCommodityList = data.data || [];

                                if ($scope.stateEqual("list")) {
                                    $rootScope.$broadcast("initItemList", {storeId: $scope.currStore.storeId});
                                }
                                else if ($scope.stateEqual("home")) {
                                    $rootScope.$broadcast("initHomePage", {storeId: $scope.currStore.storeId});
                                }
                                else if ($scope.stateEqual("order/detail")) {
                                    $rootScope.$broadcast("initOrderInfo");
                                }
                                else if ($scope.stateEqual("commodityDetail")) {
                                    $rootScope.$broadcast("initCommodityDetail");
                                }
                                else if ($scope.stateEqual("commodityGroup")) {
                                    $rootScope.$broadcast("initCommodityGroup");
                                }
                                else if ($scope.stateEqual("order")) {
                                    $rootScope.$broadcast("initOrder");
                                }
                                else if ($scope.stateEqual("posScan")) {
                                    $rootScope.$broadcast("initPosScan");
                                }
                                else if ($scope.stateEqual("activity")) {
                                    $rootScope.$broadcast("initActivity");
                                }
                            }
                        });
                    }
                    else {
                        if (!$scope.stateEqual("order") && !$scope.stateEqual("order/detail")) {
                            $scope.openAddressModal();
                        }
                        if ($scope.stateEqual("order/detail")) {
                            $rootScope.$broadcast("initOrderInfo");
                        }
                        else if ($scope.stateEqual("order")) {
                            $rootScope.$broadcast("initOrder");
                        }
                    }
                }
                else {
                    alert("statusCode:" + data.statusCode + "statusMessage:" + data.statusMessage);
                }
            }).error(function (data, status, headers, config) {
                    if (status == 0) {
                        configError++;
                        if (configError <= 3) {
                            $scope.getConfig();
                        }
                        else {
                            $scope.showComnPopup({
                                message: "当前网络异常,请重试!", type: "alert", alert: function () {
                                    configError = 0;
                                    $scope.getConfig();
                                }
                            });
                        }
                    }
                    else {
                        $scope.showComnPopup({
                            message: "errorStatus:" + status + " errorData:" + angular.toJson(data),
                            type: "alert"
                        });
                    }
                }
            );
        };
        $scope.getConfig();

        /*计算当前视图购物车商品数量*/
        $scope.calcCurrViewShoppingCartNum = function () {
            $scope.shoppingCartTotalNum = 0;
            $scope.shoppingCartTotalPrice = 0;
            if ($state.is("shoppingCart") || $state.is("pay")) {
                $scope.shoppingCart.forEach(function (item, index, array) {
                    if (item.checked) {
                        $scope.shoppingCartTotalNum += item.count;
                        $scope.shoppingCartTotalPrice += item.count * (item.promotion * 100) / 100;
                    }
                });
                $scope.mealInfoList.forEach(function (mealInfo, index, array) {
                    mealInfo.selectedCount = 0;
                    mealInfo.totalPrice = 0;
                    mealInfo.itemList.forEach(function (item) {
                        mealInfo.selectedCount += item.count;
                        mealInfo.totalPrice += item.count * (item.promotion * 100) / 100;
                    });
                });
            }
            else {
                $scope.shoppingCart.forEach(function (item, index, array) {
                    $scope.shoppingCartTotalNum += item.count;
                    $scope.shoppingCartTotalPrice += item.count * (item.promotion * 100) / 100;
                })
            }
        };
        $scope.$watch("shoppingCart", function () {
            $scope.calcCurrViewShoppingCartNum();
        }, true);


        $scope.watchCategoryList = function (i) {
            $scope.$watch("categoryList[" + i + "]", function () {
                $scope.categoryList[i].selectedCount = 0;
                $scope.categoryList[i].itemList.forEach(function (item, index, array) {
                    if (item.count) {
                        $scope.categoryList[i].selectedCount += item.count;
                    }
                })
            }, true);
        };

        $scope.addItem = function (currItem, event) {
            if (event) {
                event.stopPropagation();
            }
            if (!currItem.count) {
                currItem.count = 0;
            }
            //currItem.count++;
            //if ($scope.shoppingCart.length > 0) {
            //    if (!$scope.shoppingCart.some(function (item, index, array) {
            //            return (item === currItem)
            //        })) {
            //        $scope.shoppingCart.push(currItem);
            //    }
            //}
            //else {
            //    $scope.shoppingCart.push(currItem)
            //}

            var flyEleCR = event.currentTarget.getBoundingClientRect();
            if(!shopCartEleCR){
                shopCartEleCR = document.getElementsByClassName("icon-basket")[0].getBoundingClientRect();
            }
            var flyEle = document.createElement("img");
            flyEle.className = "flyE";
            flyEle.style.left = flyEleCR.left + "px";
            flyEle.style.top = flyEleCR.top + "px";
            flyEle.src = $scope.imgRoot + currItem.scan;
            document.body.appendChild(flyEle);

            $timeout(function () {
                flyEle.style.visibility = "hidden";
                flyEle.style.left = shopCartEleCR.left + "px";
                flyEle.style.top = shopCartEleCR.top + "px";

                currItem.count++;
                if ($scope.shoppingCart.length > 0) {
                    if (!$scope.shoppingCart.some(function (item, index, array) {
                            return (item === currItem)
                        })) {
                        $scope.shoppingCart.push(currItem);
                    }
                }
                else {
                    $scope.shoppingCart.push(currItem)
                }
            }, 50);
        };

        $scope.removeItem = function (currItem, event) {
            if (event) {
                event.stopPropagation();
            }
            if (currItem.count == 1) {
                if ($state.is("shoppingCart")) {
                    var config = {title: "是否确认删除所选餐品?", type: "confirm"};
                    config.confirm = function () {
                        $scope.shoppingCart.splice($scope.shoppingCart.indexOf(currItem), 1);
                        $scope.mealInfoList.forEach(function (mealInfo, index, array) {
                            if (mealInfo.itemList.some(function (item) {
                                    return (item === currItem)
                                })) {
                                mealInfo.itemList.splice(mealInfo.itemList.indexOf(currItem), 1);
                            }
                        });
                        currItem.count = 0;
                    };
                    $scope.showComnPopup(config);
                }
                else {
                    $scope.shoppingCart.splice($scope.shoppingCart.indexOf(currItem), 1);
                    currItem.count = 0;
                }
            }
            else {
                currItem.count--;
            }
        };

        $scope.refreshView = function () {
            $scope.currBusiness = {};
            $scope.currCoupons = {};
            $scope.currUserAddress = {};
            for (var i = 0; i < $scope.categoryList.length; i++) {
                $scope.categoryList[i].itemList = [];
            }
            if ($scope.shoppingCart.length > 0) {
                $scope.shoppingCart = [];
                $scope.shoppingCartTotalNum = 0;
                $scope.shoppingCartTotalPrice = 0;
            }
            $http.post("/goods/getNewCommodityList", {
                storeId: $scope.currStore.storeId,
                pageSize: 0
            }).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.totalCommodityList = data.data || [];

                    if ($scope.stateEqual("list")) {
                        $rootScope.$broadcast("initItemList", {storeId: $scope.currStore.storeId});
                    }
                    else if ($scope.stateEqual("home")) {
                        $rootScope.$broadcast("initHomePage", {storeId: $scope.currStore.storeId});
                    }
                    else if ($scope.stateEqual("commodityDetail")) {
                        $rootScope.$broadcast("initCommodityDetail");
                    }
                    else if ($scope.stateEqual("commodityGroup")) {
                        $rootScope.$broadcast("initCommodityGroup");
                    }
                    else if ($scope.stateEqual("order")) {
                        $rootScope.$broadcast("initOrder");
                    }
                    else if ($scope.stateEqual("activity")) {
                        $rootScope.$broadcast("initActivity");
                    }
                }
            });
        };
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

        /*门店过滤*/
        $scope.storeFilter = function (item) {
            if (!$scope.storeKey || $scope.storeKey.length == 0) {
                return item.online == 1;
            }
            else if ($scope.storeKey.length > 0) {
                return item.online == 1 && (item.name.indexOf($scope.storeKey) >= 0 || item.address.indexOf($scope.storeKey) >= 0);
            }
        };
        /*初始化购物车数据源*/
        $scope.initCart = function () {
            /*是否已设置过第一个餐别餐别选中状态标记*/
            var checkedFlg = false;
            /*重置所有商品选中状态*/
            $scope.shoppingCart.forEach(function (item) {
                item.checked = false;
            });
            $scope.mealInfoList.forEach(function(mealInfo){
                /*重置当前餐别参数*/
                mealInfo.checked = false;
                mealInfo.selectedCount = 0;
                mealInfo.totalPrice = 0;
                mealInfo.itemList = [];
                /*将购物车商品填充进对应餐别商品List中*/
                $scope.shoppingCart.forEach(function (item) {
                    if (item.mealId == mealInfo.id) {
                        mealInfo.selectedCount += item.count;
                        mealInfo.totalPrice += item.count * (item.promotion * 100) / 100;
                        mealInfo.itemList.push(item);
                    }
                });
                /*如果是全时段商品则默认选中,其余时段默认选中第一个餐别*/
                if (mealInfo.id == 1) {
                    if (mealInfo.selectedCount != 0) {
                        mealInfo.checked = true;
                        mealInfo.itemList.forEach(function (item) {
                            item.checked = true;
                        })
                    }
                }
                else {
                    if (mealInfo.selectedCount != 0 && !checkedFlg) {
                        mealInfo.checked = true;
                        mealInfo.itemList.forEach(function (item) {
                            item.checked = true;
                        });
                        checkedFlg = true;
                    }
                }
            });
        };

        var wxInit = {deferred: $q.defer()};
        wxInit.promise = wxInit.deferred.promise;
        $scope.shareToPromiseList.push(wxInit.promise);
        $http.post("/index/getWeChatJsSign?url=" + $scope.wxCheckSignHost, {url: $scope.wxCheckSignHost}).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                wx.config(angular.fromJson(data.data));
                wx.ready(function () {
                    wxInit.deferred.resolve("loaded!");
                    //wx.hideOptionMenu();
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
    }])
    .factory("ltTimeSet", ["$filter", function ($filter) {
        var isShowToday = true;
        return {
            getTimeFn: function (dateList, timeList) {
                var resultList = [];
                var nowTime = new Date();
                var todayTime = new Date(dateList[0].date.replace(/\./g, "/") + " 18:30");
                //var tomorrowTime = new Date(dateList[1].date.replaceAll(".","/") + " 11:30");
                if (nowTime > todayTime) {
                    isShowToday = false;
                }
                else {
                    isShowToday = true;
                }
                for (var i = 0; i < dateList.length; i++) {
                    var tem = {};
                    tem.valueName = dateList[i].chineseDate + "(" + dateList[i].sequence + ")";
                    tem.value = dateList[i].date;
                    tem.list = [];
                    resultList.push(tem);
                }
                for (var j = 0; j < timeList.length; j++) {
                    var st = timeList[j].valueName.split("-")[0];
                    var splitTime = new Date($filter("date")(nowTime, "yyyy/MM/dd ") + st);
                    var sts = st.split(":");
                    timeList[j].index = Number(sts.join(""));
                    /*过滤掉已经过去的时间选项*/
                    if (splitTime > nowTime) {
                        resultList[0].list.push(timeList[j]);
                    }
                    /*过滤掉明天12点后时间选项(已注释)*/
                    //if (sts[0] < 12) {
                    //    resultList[1].list.push(timeList[j]);
                    //}
                    resultList[1].list.push(timeList[j]);
                }
                if (!isShowToday || resultList[0].list.length == 0) {
                    resultList.shift();
                }
                return resultList;
            }
        };
    }])
    .filter("filterModel",[function(){
        return function (input, type) {
            var tmpStr = input || "";
            var tmpArray = tmpStr.split(",");
            if(type == "orderNumber"){
                return tmpArray[0];
            }
            else if(type == "address"){
                return tmpArray[1];
            }
        };
    }])
    .service("order", ["$scope", "$state", function ($scope, $state) {
        var self = this;
        self.mealInfoId = 0;
        self.takeType = 1;
    }]);