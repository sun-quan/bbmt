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
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("activityCtrl", ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {
    $scope.$on("initActivity", function (event) {
        $scope.initActivity();
    });
    $scope.initActivity = function () {
        if($stateParams.activityId){
            $http.post("/activities/findActivity", {activityId: $stateParams.activityId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.$parent.activityInfo.frameList = data.data.content;
                }
            });
        }
        else{
            $scope.showComnPopup({
                message: "活动ID不存在", type: "alert", alert: function () {
                    $scope.go("home");
                }
            });
        }
    };

    if ($scope.$parent.totalCommodityList.length > 0) {
        $scope.initActivity();
    }

    $scope.changeView = function (frameInfo,modelInfo) {
        if(frameInfo.frame == 1){/*1*1布局*/
            if(modelInfo.moduleType == 1 && modelInfo.value){/*URL*/
                location.href = modelInfo.value;
            }
            else if(modelInfo.moduleType == 2 && modelInfo.value){/*商品ID*/
                $scope.go("commodity-detail",{commodityId:modelInfo.value})
            }
        }
    };
}]);
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("addressCtrl", ["$scope", "$http","$ionicModal","$stateParams", function ($scope, $http,$ionicModal,$stateParams) {
    $scope.from = $stateParams.from;

    $scope.renderAddressView = function(){
        $http.post("/address/getAddressList", {test: 1}).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                $scope.addressList = data.data;
                if($scope.from == "pay"){
                    $http.post("/address/getAddressListByStore", {storeId: $scope.$parent.currStore.storeId}).success(function (data, status, headers, config) {
                        if (data.statusCode == 0) {
                            data.data.forEach(function(availableItem){
                                $scope.addressList.forEach(function(item){
                                    if(availableItem.addressId == item.addressId){
                                        item.isAvailable = true;
                                    }
                                })
                            })
                        }
                    });
                }
            }
        });
    };

    $ionicModal.fromTemplateUrl("userAddress.html", {
        scope: $scope,
        animation: "slide-in-left"
    }).then(function (modal) {
        $scope.userAddressModal = modal;
    });
    $scope.closeUserAddressModal = function () {
        $scope.userAddressModal.hide();
    };

    $scope.openUserAddressModal = function (item) {
        $http.post("/address/getStoreDistributionAddressList", {storeId: $scope.$parent.currStore.storeId}).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                $scope.storeDistributionAddressList = data.data;
                if($scope.storeDistributionAddressList.length == 0){
                    $scope.showComnPopup({message: "没有可用的商圈地址!", type: "toast"});
                    return;
                }
                if (item) {
                    $scope.currUserAddress = angular.copy(item);
                }
                else {
                    $scope.currUserAddress = {isDefault:2,status:10,storeAddressId:$scope.storeDistributionAddressList[0].addressId,sex:1};
                }
                $scope.userAddressModal.show();
            }
        });
    };

    $scope.saveUserAddress = function () {
        if(!$scope.currUserAddress.consignee || $scope.currUserAddress.consignee.length == 0){
            $scope.showComnPopup({message: "请填写收货人姓名!", type: "toast"});
            return;
        }
        if(!$scope.currUserAddress.sex){
            $scope.showComnPopup({message: "请选择性别!", type: "toast"});
            return;
        }
        if(!$scope.currUserAddress.storeAddressId){
            $scope.showComnPopup({message: "请选择收货地址!", type: "toast"});
            return;
        }
        if(!$scope.currUserAddress.address  || $scope.currUserAddress.address.length == 0){
            $scope.showComnPopup({message: "请输入门牌号!", type: "toast"});
            return;
        }
        if(!/^1[\d]{10}$/.test($scope.currUserAddress.phone)){
            $scope.showComnPopup({message: "请输入正确的手机号!", type: "toast"});
            return;
        }
        var submit = $scope.currUserAddress;
        $scope.storeDistributionAddressList.forEach(function(item){
            if(item.addressId == $scope.currUserAddress.storeAddressId){
                submit.area = item.area
            }
        });

        $http.post("/address/saveAddress", submit).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                $scope.renderAddressView();
            }
        });
        $scope.userAddressModal.hide();
    };

    $scope.setUserDefaultAddress = function (item) {
        $http.post("/address/saveAddress", item).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                $scope.renderAddressView();
            }
        });
    };

    $scope.useUserAddress = function (item) {
        if($scope.from){
            if(item.isAvailable){
                $scope.$parent.currUserAddress = item;
                $scope.userAddressModal.hide();
                history.back();
            }
            else{
                $scope.showComnPopup({message: "当前地址不可用,请重新选择!", type: "alert"});
            }
        }
    };

    $scope.deleteAddress = function(item){
        var config = {title: "是否确认删除当前地址?", type: "confirm"};
        config.confirm = function () {
            item.status = 20;
            $http.post("/address/saveAddress", item).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.renderAddressView();
                }
            });
        };
        $scope.showComnPopup(config);
    };

    $scope.renderAddressView();
}]);
/**
 * Created by cjd on 2015/12/19.
 */
angular.module("xsyh").controller("detailCtrl", ["$scope", "$http","$stateParams", function ($scope, $http,$stateParams) {
    $scope.initCommodityDetail = function(){
        if($stateParams.commodityId){
            $scope.currItem = $scope.$parent.totalCommodityList.filter(function (item) {
                return (item.commodityId == $stateParams.commodityId)
            })[0];
        }
    };
    if($scope.$parent.totalCommodityList.length > 0){
        $scope.initCommodityDetail();
    }
    else{
        $scope.currItem = null;
    }
    $scope.$on("initCommodityDetail", function (event) {
        $scope.initCommodityDetail();
    });
}]);
/**
 * Created by cjd on 2016/3/8.
 */
angular.module("xsyh").controller("commodityGroupCtrl", ["$scope", "$http", "$stateParams", "$interval", "$ionicBackdrop","$q", function ($scope, $http, $stateParams, $interval, $ionicBackdrop,$q) {
    $scope.$on("$ionicView.leave", function () {
        if ($scope.$parent.activityInfo.showShareMask) {
            $scope.$parent.activityInfo.showShareMask = false;
        }
        if ($scope.timer) {
            $interval.cancel($scope.timer)
        }
    });

    var groupInit = {deferred: $q.defer()};
    groupInit.promise = groupInit.deferred.promise;
    $scope.$parent.shareToPromiseList.push(groupInit.promise);
    $q.all($scope.$parent.shareToPromiseList).then(function (result) {
        $scope.shareTo();
    }, function (error) {
        alert("Fail: " + error);
    });

    $scope.initCommodityGroup = function () {
        /*获取分享用户ID*/
        if(location.hash.indexOf("shareMemberInfoId") >= 0){
            $scope.$parent.order.shareMemberInfoId = location.hash.replace(/.*[\?|\&]shareMemberInfoId\=([^\&]*)\&?.*/, "$1");
        }
        if($stateParams.activityId){
            $scope.$parent.order.shareActivityId = $stateParams.activityId;
            /*通过活动ID获取活动信息*/
            $http.post("/activities/findActivity", {activityId: $stateParams.activityId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.$parent.activityInfo = data.data;

                    var commodityId = $scope.$parent.activityInfo.commodityId;
                    $scope.$parent.activityInfo.commodity = $scope.$parent.totalCommodityList.filter(function (item) {
                        return (item.commodityId == commodityId)
                    })[0];
                    if(!$scope.$parent.activityInfo.commodity){
                        $scope.showComnPopup({
                            message: "团购商品暂未上架", type: "alert", alert: function () {
                                $scope.go("home");
                            }
                        });
                    }
                    /*判断当前门店是否合法*/
                    $scope.$parent.activityInfo.storeInfo = $scope.$parent.storeList.filter(function (item) {
                        return (item.storeId == $scope.$parent.currStore.storeId)
                    })[0];
                    /*判断活动时间*/
                    $scope.cd = Math.floor(($scope.$parent.activityInfo.endtime - new Date().getTime()) / 1000);
                    $scope.CD = function () {
                        var cd = $scope.cd;
                        $scope.$parent.activityInfo.CDHours = Math.floor(cd / 3600);
                        $scope.$parent.activityInfo.CDMinute = Math.floor((cd - 3600 * $scope.$parent.activityInfo.CDHours) / 60);
                        $scope.$parent.activityInfo.CDSecond = Math.ceil(cd - 3600 * $scope.$parent.activityInfo.CDHours - 60 * $scope.$parent.activityInfo.CDMinute);
                        if ($scope.$parent.activityInfo.CDSecond == 60) {
                            $scope.$parent.activityInfo.CDMinute++;
                            $scope.$parent.activityInfo.CDSecond = 0;
                        }
                        if ($scope.$parent.activityInfo.CDHours < 10) {
                            $scope.$parent.activityInfo.CDHours = "0" + $scope.$parent.activityInfo.CDHours;
                        }
                        if ($scope.$parent.activityInfo.CDMinute < 10) {
                            $scope.$parent.activityInfo.CDMinute = "0" + $scope.$parent.activityInfo.CDMinute;
                        }
                        if ($scope.$parent.activityInfo.CDSecond < 10) {
                            $scope.$parent.activityInfo.CDSecond = "0" + $scope.$parent.activityInfo.CDSecond;
                        }
                        $scope.cd--
                    };

                    if ($scope.cd <= 0) {
                        $scope.$parent.activityInfo.CDHours = "00";
                        $scope.$parent.activityInfo.CDMinute = "00";
                        $scope.$parent.activityInfo.CDSecond = "00";
                        $scope.showComnPopup({
                            message: "团购活动已结束", type: "alert", alert: function () {
                                $scope.go("home");
                            }
                        });
                    }
                    else {
                        if ($scope.$parent.activityInfo.starttime <= new Date().getTime()) {
                            $scope.timer = $interval(function () {
                                $scope.CD();
                            }, 1000);
                            $scope.CD();

                            groupInit.deferred.resolve("loaded!");
                        }
                        else {
                            $scope.showComnPopup({
                                message: "团购活动还未开始!", type: "alert", alert: function () {
                                    $scope.go("home");
                                }
                            });
                        }
                    }
                }
            });
        }
        else{
            $scope.showComnPopup({
                message: "活动ID不存在!", type: "alert", alert: function () {
                    $scope.go("home");
                }
            });
        }
    };
    if ($scope.$parent.totalCommodityList.length > 0) {
        $scope.initCommodityGroup();
    }
    $scope.$on("initCommodityGroup", function (event) {
        $scope.initCommodityGroup();
    });

    /*分享至朋友圈和朋友*/
    $scope.shareTo = function (type) {
        var shareLink = location.origin + "/index/indexpage?type=70&shareMemberInfoId=" + $scope.$parent.userInfo.memberInfoId + "&storeId=" + $scope.$parent.activityInfo.storeInfo.storeId + "&activityId=" + $scope.$parent.activityInfo.activityId;
        var title = $scope.$parent.activityInfo.commodity.promotion + "元|" + $scope.$parent.activityInfo.name;
        var imgUrl = $scope.imgRoot + $scope.$parent.activityInfo.commodity.commodityBigImg;
        if (type) {
            $scope.$parent.activityInfo.showShareMask = true;
        }
        else{
            //朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                link: shareLink, // 分享链接       (用户ID+门店ID+活动ID)
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            /*朋友圈*/
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: shareLink, // 分享链接       (用户ID+门店ID+活动ID)
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    };
}]);
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("couponsCtrl", ["$scope", "$http","$stateParams","$filter", function ($scope, $http,$stateParams,$filter) {
    $scope.from = $stateParams.from;
    $scope.showHistoryFlg = false;
    $http.post("/coupons/getCouponsList", {test: 1}).success(function (data, status, headers, config) {
        if (data.statusCode == 0) {
            var nowTick = new Date().getTime();
            if ($scope.from == "pay") {
                $scope.couponsList = data.data.filter(function (coupons) {
                    if (coupons.stores) {
                        coupons.stores = "," + coupons.stores + ",";
                    }
                    if (coupons.commodities) {
                        coupons.commodities = "," + coupons.commodities + ",";
                    }
                    if (!coupons.stores || (coupons.stores.indexOf("," + $scope.$parent.currStore.storeId + ",") >= 0 && coupons.starttime <= nowTick && nowTick <= coupons.endtime)) {
                        return $scope.$parent.shoppingCart.filter(function (item) {
                            return (item.checked)
                        }).some(function (item) {
                            return (!coupons.commodities || coupons.commodities.indexOf("," + item.commodityId + ",") >= 0)
                        })
                    }
                    else {
                        return false;
                    }
                });
                $scope.couponsList.forEach(function (item) {
                    item.displayTime = $filter("date")(item.starttime, "yyyy-MM-dd") + "~" + $filter("date")(item.endtime, "yyyy-MM-dd");
                    if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId == item.couponsId) {
                        item.checked = true;
                    }
                });
            }
            else if ($scope.from == "my") {
                $scope.couponsList = data.data.forEach(function (item) {
                    if(nowTick > item.endtime && item.status == 1){
                        item.status = 4;
                    }
                });
                $scope.couponsList = data.data;
            }
            $scope.couponsList.forEach(function (item) {
                item.displayTime = $filter("date")(item.starttime, "yyyy-MM-dd") + "~" + $filter("date")(item.endtime, "yyyy-MM-dd");
            });
        }
    });

    $scope.useCoupons = function (item) {
        if ($scope.from == "pay") {
            item.checked = true;
            $scope.$parent.currCoupons = item;
            $scope.discountPrice = $scope.$parent.shoppingCartTotalPrice;
            if($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId){
                $scope.discountPrice = $scope.discountPrice * $scope.$parent.TakeType3.discount;
            }
            $scope.discountPrice = $scope.discountPrice - $scope.$parent.currCoupons.price;
            $scope.$parent.order.price = $scope.discountPrice >= 0 ? $filter("number")($scope.discountPrice, 2) : 0.00;
            $scope.go("pay",{from:"coupons"})
        }
    };
    $scope.noUseCoupons = function () {
        if ($scope.from == "pay") {
            $scope.$parent.currCoupons = null;
            $scope.discountPrice = $scope.$parent.shoppingCartTotalPrice;
            if($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId){
                $scope.discountPrice = $scope.discountPrice * $scope.$parent.TakeType3.discount;
            }
            $scope.$parent.order.price = $scope.discountPrice >= 0 ? $filter("number")($scope.discountPrice, 2) : 0.00;
        }
        $scope.go("pay",{from:"coupons"})
    };

    $scope.showHistory = function(){
        $scope.showHistoryFlg =  $scope.showHistoryFlg ? !$scope.showHistoryFlg : true;
    };
}]);
/**
 * Created by cjd on 2015/12/25.
 */
angular.module("xsyh").controller("groupInfoCtrl", ["$scope", "$http","$stateParams", function ($scope, $http,$stateParams) {
    $http.post("/order/findGroupBuyPeople", {groupMealId: $stateParams.groupMealId}).success(function (data) {
        if (data.statusCode == 0) {
            $scope.groupMealList = data.data;
        } else {
            alert(data.statusMessage);
        }
    });
}]);
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("homeCtrl", ["$scope", "$http","$ionicHistory","$q","$timeout","$ionicSlideBoxDelegate", function ($scope, $http,$ionicHistory,$q,$timeout,$ionicSlideBoxDelegate) {

    $scope.initHomePage = function () {
        $http.post("/index/getHomePage", {storeId: $scope.currStore.storeId}).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                $scope.frameList = data.data.modelInfoList.content;
                $scope.themeList = data.data.themeList;
                //$scope.bannerList = data.data.bannerListItemVoList;
                //$scope.modelList = data.data.modelListItemVoList;
                //$scope.themeList = data.data.themeList;
                //$scope.showBannerList = true;
                //$timeout(function(){
                //    $ionicSlideBoxDelegate.$getByHandle("banner").update();
                //},100);

                //$scope.promiseList = [];
                //$scope.bannerList.forEach(function (item) {
                //    item.deferred = $q.defer();
                //    item.promise = item.deferred.promise;
                //    $scope.promiseList.push(item.promise);
                //    item.promise.then(function (result) {
                //
                //    }, function (error) {
                //        alert("Fail: " + error);
                //    });
                //    item.imageUrl = $scope.imgRoot + item.image;
                //    $scope.getImgBlob(item);
                //});
                //$q.all($scope.promiseList).then(function (result) {
                //    $scope.showBannerList = true;
                //}, function (error) {
                //    alert("Fail: " + error);
                //});

                //$scope.promiseList = [];
                //$scope.bannerList.forEach(function (item) {
                //    item.deferred = $q.defer();
                //    item.promise = item.deferred.promise;
                //    $scope.promiseList.push(item.promise);
                //    item.promise.then(function (result) {
                //
                //    }, function (error) {
                //        alert("Fail: " + error);
                //    });
                //    item.imageUrl = $scope.imgRoot + item.image;
                //    item.imageObj = new Image();
                //    item.imageObj.onload = function(item){
                //        item.deferred.resolve("loaded!");
                //    };
                //    item.imageObj.src = item.imageUrl;
                //});
                //$q.all($scope.promiseList).then(function (result) {
                //    $scope.showBannerList = true;
                //}, function (error) {
                //    alert("Fail: " + error);
                //});
            }
        });
    };

    //$scope.$on("$ionicView.enter",function(){
    //    /*设置底部导航栏索引*/
    //    $scope.$parent.currFooterMenu = 0;
    //    if ($scope.currStore && $scope.currStore.storeId) {
    //        $scope.initHomePage();
    //    }
    //});

    $scope.$on("initHomePage", function (event) {
        $scope.initHomePage();
    });

    $scope.changeView = function (frameInfo,modelInfo,item) {
        if(frameInfo.frame == 1){/*1*1布局*/
            if(modelInfo.type == 1){/*轮播组件*/
                if(item.type == 1 && item.value){/*URL:转跳至新的外部URL*/
                    if(item.value.indexOf("?") > 0){
                        location.href = item.value + "&storeId=" + $scope.currStore.storeId;
                    }
                    else{
                        location.href = item.value + "?storeId=" + $scope.currStore.storeId;
                    }
                }
                else if(item.type == 2){/*商品详情:转跳至商品详情*/
                    location.href = "#/commodityDetail?commodityId=" + item.value + "&storeId=" + $scope.currStore.storeId;
                }
                else if(item.type == 3){/*我的订单:转跳至我的订单*/
                    location.href = "#/order?orderType=nopay";
                }
                else if(item.type == 4){/*团餐:转跳至团餐快捷入口*/
                }
                else if(item.type == 5){/*优惠券:转跳至我的优惠券*/
                    location.href = "#/coupons?from=my";
                }
                else if(item.type == 6){/*虚拟类目:转跳至???*/
                }
                else if(item.type == 7){/*取餐号:转跳至???*/
                    location.href = "#/coupons?from=my";
                }
            }
            else if(modelInfo.type == 2 && modelInfo.elements[0].value){/*URL*/
                if(modelInfo.elements[0].value.indexOf("?") > 0){
                    location.href = modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
                }
                else{
                    location.href = modelInfo.elements[0].value + "?storeId=" + $scope.currStore.storeId;
                }
            }
            else if(modelInfo.type == 6){/*取餐号*/
                if(modelInfo.elements[0].type == 1){/*URL:转跳至新的外部URL*/
                    if(modelInfo.elements[0].value.indexOf("?") > 0){
                        location.href = modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
                    }
                    else{
                        location.href = modelInfo.elements[0].value + "?storeId=" + $scope.currStore.storeId;
                    }
                }
                else if(modelInfo.elements[0].type == 5){/*优惠券:转跳至我的优惠券*/
                    location.href = "#/coupons?from=my";
                }
                else if(modelInfo.elements[0].type == 7){/*取餐号:转跳至待取餐*/
                    location.href = "#/order?orderType=wait";
                }
            }
        }
        else if (frameInfo.frame == 2) {/*1*2布局*/
            if(modelInfo.type == 3){/*商品详情*/
                location.href = "#/commodityDetail?commodityId=" + modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
            }
            else if(modelInfo.type == 2 && modelInfo.elements[0].value){/*URL*/
                if(modelInfo.elements[0].value.indexOf("?") > 0){
                    location.href = modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
                }
                else{
                    location.href = modelInfo.elements[0].value + "?storeId=" + $scope.currStore.storeId;
                }
            }
        }
        else if (frameInfo.frame == 3) {/*1*3布局*/
            //if(modelInfo.type == 3){/*商品详情*/
            //    location.href = "#/commodityDetail?commodityId=" + modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
            //}
            //else if(modelInfo.type == 2 && modelInfo.elements[0].value != ""){/*URL*/
            //    location.href = modelInfo.elements[0].value;
            //}
            //$scope.showComnPopup({
            //    message: "很抱歉,暂时无法响应1*3布局点击事件!",
            //    type: "toast"
            //});
        }
        else if (frameInfo.frame == 4) {/*1*4布局*/
            if(modelInfo.type == 4){/*虚拟类目*/
                $scope.themeList.forEach(function(item,index){
                    if(item.id == modelInfo.elements[0].value){
                        location.href = "#/list?from=custom_" + index + "&storeId=" + $scope.currStore.storeId;
                    }
                })
            }
            else if(modelInfo.type == 2 && modelInfo.elements[0].value){/*URL*/
                if(modelInfo.elements[0].value.indexOf("?") > 0){
                    location.href = modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
                }
                else{
                    location.href = modelInfo.elements[0].value + "?storeId=" + $scope.currStore.storeId;
                }
            }
        }
        else if (frameInfo.frame == 5) {/*1*4布局*/
            if(modelInfo.type == 3){/*商品详情*/
                location.href = "#/commodityDetail?commodityId=" + modelInfo.elements[0].value + "&storeId=" + $scope.currStore.storeId;
            }
            else if(modelInfo.type == 2 && modelInfo.elements[0].value){/*URL*/
                location.href = modelInfo.elements[0].value;
            }
        }
    };
    $scope.updateSlideBox = function(){
        $ionicSlideBoxDelegate.$getByHandle("banner").update();
    };

    $scope.$parent.currFooterMenu = 0;
    if ($scope.currStore && $scope.currStore.storeId) {
        $scope.initHomePage();
    }
    else if(!$scope.currStore && $ionicHistory.backView()){
        $scope.$parent.openAddressModal();
    }
    /*图片预加载*/
    $scope.getImgBlob = function(item){
        $http.get(item.imageUrl, {
            responseType: "blob"
        }).success(function (data) {
            var blob = new Blob([data], {type: "image/png"});
            item.imageUrl = webkitURL.createObjectURL(blob);
            item.deferred.resolve("loaded!");
        })
            .error(function(){
                item.imageUrl = "";
                item.deferred.resolve("loaded!");
            });
    }
}]);
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("listCtrl", ["$scope", "$ionicScrollDelegate", "$timeout", "$http","$stateParams", function ($scope, $ionicScrollDelegate, $timeout, $http,$stateParams) {
    $scope.from = $stateParams.from;
    $scope.$on("$ionicView.enter",function(){
        $scope.$parent.calcCurrViewShoppingCartNum();
    });
    $scope.initItemList = function () {
        $scope.$parent.currIndex = 0;
        $scope.totalItemList = [];
        var contentHeight = document.getElementsByTagName("ion-content")[0].offsetHeight;
        if ($scope.from && $scope.from.indexOf("custom") != -1) {
            /*自定义标签*/
            $http.post("/goods/getListCommodity", {storeId: $scope.$parent.currStore.storeId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    /*左侧菜单项*/
                    $scope.$parent.categoryList = data.data.themeList;

                    $scope.$parent.categoryList.forEach(function (category, index, array) {
                        /*左侧菜单项添加对应商品集合*/
                        category.itemList = data.data.commodityList[index];
                        /*保存对应商品临时集合*/
                        var tmpItemList = category.itemList;
                        /*清空左侧菜单项对应商品集合*/
                        category.itemList = [];
                        /*遍历对应商品临时集合,在全部商品集合中查找对应商品并添加至左侧菜单项对应商品集合*/
                        tmpItemList.forEach(function(item,index,array){
                            var tmpList = $scope.$parent.totalCommodityList.filter(function (item3) {
                                return (item && item3.commodityId == item.commodityId)
                            });
                            if(tmpList.length > 0){
                                category.itemList.push(tmpList[0]);
                            }
                        });
                        /*设置每个左侧菜单项对应的右侧商品集合的高度*/
                        category.height = category.itemList.length * $scope.itemHeight + $scope.itemTabHeight;
                        /*添加商品集合标题*/
                        category.itemList.unshift({"name": category.name});
                        /*设置第一项菜单右侧商品集合的滚动属性*/
                        if (index == 0) {
                            category.scrollTo = 0;
                            $scope.class0 = category.height;
                        }
                        else if (index == (array.length - 1)) {/*设置最后一项菜单右侧商品集合的滚动属性*/
                            if (contentHeight > category.height) {
                                $scope.fixedCount = Math.ceil((contentHeight - category.height) / $scope.itemHeight);
                                category.itemList.push({
                                    "empty": true,
                                    "height": $scope.fixedCount * $scope.itemHeight
                                });
                                category.height = (category.itemList.length - 1 + $scope.fixedCount) * $scope.itemHeight + $scope.itemTabHeight;
                            }
                            category.scrollTo = $scope["class" + (index - 1)];
                            $scope["class" + index] = $scope["class" + (index - 1)] + category.height;
                        }
                        else {
                            category.scrollTo = $scope["class" + (index - 1)];
                            $scope["class" + index] = $scope["class" + (index - 1)] + category.height;
                        }
                        /*勿删!页面遍历所有商品需要用到*/
                        Array.prototype.push.apply($scope.totalItemList, category.itemList);
                        /*watch左侧菜单选中项计数*/
                        $scope.$parent.watchCategoryList(index);
                    });
                    $scope.scrollTo($scope.$parent.categoryList[+$scope.from.substring(7)], +$scope.from.substring(7));
                    $scope.mainScroll.resize();
                }
            });
        }
        //else {
        //    /*商品分类*/
        //    $scope.$parent.categoryList = $scope.$parent.categoryListBak;
        //    $scope.$parent.categoryList.forEach(function (category, index, array) {
        //        category.itemList = $scope.$parent.totalCommodityList.filter(function (item) {
        //            return (item.commodityClass == category.categoryId)
        //        });
        //        category.height = category.itemList.length * $scope.itemHeight + $scope.itemTabHeight;
        //        category.itemList.unshift({"name": category.name, "commodityClass": category.categoryId});
        //        if (index == 0) {
        //            category.scrollTo = 0;
        //            $scope.class0 = category.height;
        //        }
        //        else if (index == (array.length - 1)) {
        //            if (contentHeight > category.height) {
        //                $scope.fixedCount = Math.ceil((contentHeight - category.height) / $scope.itemHeight);
        //                category.itemList.push({
        //                    "empty": true,
        //                    "commodityClass": category.categoryId,
        //                    "height": $scope.fixedCount * $scope.itemHeight
        //                });
        //                category.height = (category.itemList.length - 1 + $scope.fixedCount) * $scope.itemHeight + $scope.itemTabHeight;
        //            }
        //            category.scrollTo = $scope["class" + (index - 1)];
        //            $scope["class" + index] = $scope["class" + (index - 1)] + category.height;
        //        }
        //        else {
        //            category.scrollTo = $scope["class" + (index - 1)];
        //            $scope["class" + index] = $scope["class" + (index - 1)] + category.height;
        //        }
        //        Array.prototype.push.apply($scope.totalItemList, category.itemList);
        //        $scope.$parent.watchCategoryList(index);
        //    });
        //}
    };
    $scope.$on("initItemList", function (event) {
        $scope.initItemList();
    });
    $scope.$parent.shoppingCart.reverse();
    $scope.mainScroll = $ionicScrollDelegate.$getByHandle("mainScroll");
    $scope.swipe = function () {
        $timeout(function () {
            $scope.top = $scope.mainScroll.getScrollPosition().top;
            $scope.$parent.currIndex = 0;
            $scope.$parent.categoryList.forEach(function (category, index, array) {
                if ($scope.top >= category.scrollTo) {
                    $scope.$parent.currIndex = index;
                }
            })
        }, 0);
    };

    $scope.scrollTo = function (item, index) {
        if (index != $scope.$parent.currIndex) {
            $scope.mainScroll.scrollTo(null, item.scrollTo, false);
        }
        $scope.$parent.currIndex = index;
    };
    if ($scope.currStore && $scope.currStore.storeId) {
        $scope.initItemList();
    }
}]);
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("myCtrl", ["$scope", "$http","$ionicModal", function ($scope, $http, $ionicModal) {
    $scope.$parent.currFooterMenu = 3;
}]);


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
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("payCtrl", ["$scope", "$http", "$filter", "$timeout", "$ionicModal", "$ionicBackdrop", "ltTimeSet", "$ionicPopup", "$stateParams","$ionicHistory", function ($scope, $http, $filter, $timeout, $ionicModal, $ionicBackdrop, ltTimeSet, $ionicPopup, $stateParams,$ionicHistory) {
    /*监听页面离开事件,关闭modal对话框*/
    $scope.$on("$ionicView.leave", function (event) {
        if ($scope.businessPopup && $scope.businessPopup.close) {
            $scope.businessPopup.close();
        }
        if ($scope.businessAddressModal && $scope.businessAddressModal.isShown()) {
            $scope.businessAddressModal.remove();
        }
        if ($scope.couponsModal && $scope.couponsModal.isShown()) {
            $scope.couponsModal.remove();
        }
        if($scope.$parent.showMutilScroll){
            $scope.$parent.closeMutilScrollPopup();
        }
    });
    //$scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    //    $ionicHistory;
    //    if (fromState.name == "pay") {
    //        if(toState.name == "list"){
    //            if ($scope.businessPopup && $scope.businessPopup.close) {
    //                $scope.businessPopup.close();
    //                event.preventDefault();
    //            }
    //            if ($scope.businessAddressModal && $scope.businessAddressModal.isShown()) {
    //                $scope.businessAddressModal.remove();
    //                event.preventDefault();
    //            }
    //            if ($scope.couponsModal && $scope.couponsModal.isShown()) {
    //                $scope.couponsModal.remove();
    //                event.preventDefault();
    //            }
    //            if($scope.$parent.showMutilScroll){
    //                $scope.$parent.closeMutilScrollPopup();
    //                event.preventDefault();
    //            }
    //        }
    //    }
    //});
    $scope.$on("$ionicView.enter", function () {
        /*购物车为空,跳转至首页*/
        if ($scope.$parent.shoppingCart.length == 0) {
            location.href = "#/home";
            return;
        }
        /*获取上一个页面*/
        $scope.from = $stateParams.from;
        /*每次进入结算页面时清空当前优惠券信息*/
        $scope.$parent.currCoupons = {};
        /*当选择团餐时,保存当前合作企业信息*/
        $scope.$parent.TakeType3 = {};
        /*将时间数组转换为对象属性方便后续使用*/
        $scope.distributionTime = {};
        $scope.$parent.timeList.forEach(function (time) {
            $scope.distributionTime[time.value] = time;
        });

        /*生成订单包含的商品List*/
        $scope.$parent.order.orderInfoVoList = [];
        $scope.$parent.shoppingCart.forEach(function (item) {
            if (item.checked) {
                var obj = {};
                obj.commodityId = item.commodityId;
                obj.commodityNum = item.count;
                $scope.$parent.order.orderInfoVoList.push(obj);
            }
        });

        /*计算实付款*/
        $scope.calcOrderPrice = function(){
            ///*拿到餐品总额*/
            //$scope.discountPrice = $scope.$parent.shoppingCartTotalPrice;
            ///*判断是否为企业团餐,是:减去团餐折扣*/
            //if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId && $scope.$parent.order.takeType == 3) {
            //    $scope.discountPrice = $scope.discountPrice * $scope.$parent.TakeType3.discount;
            //}
            ///*判断是否使用了优惠券,是:减去优惠券金额*/
            //if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId) {
            //    $scope.discountPrice = $scope.discountPrice - $scope.$parent.currCoupons.price;
            //}
            ///*如果是门店配送加上配送费*/
            //if ($scope.$parent.order.takeType == 2) {
            //    if ($scope.discountPrice < 0) {
            //        $scope.discountPrice = 0;
            //    }
            //    $scope.discountPrice += $scope.$parent.currStore.distributePrice;
            //}
            ///*如果当前金额大于0,格式化*/
            //if ($scope.discountPrice >= 0) {
            //    $scope.$parent.order.price = $filter("number")($scope.discountPrice, 2);
            //}
            //else {
            //    $scope.$parent.order.price = 0.00;
            //}

            /*拿到餐品总额*/
            $scope.discountPrice = $scope.$parent.shoppingCartTotalPrice;
            /*判断是否为企业团餐,是:减去团餐折扣*/
            if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId && $scope.$parent.order.takeType == 3) {
                $scope.discountPrice = $scope.discountPrice * $scope.$parent.TakeType3.discount;
            }
            /*判断是否使用了优惠券,是:减去优惠券金额*/
            if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId) {
                $scope.discountPrice = $scope.discountPrice - $scope.$parent.currCoupons.price;
            }
            /*如果是门店配送加上配送费*/
            if ($scope.$parent.order.takeType == 2) {
                if ($scope.discountPrice < 0) {
                    $scope.discountPrice = 0;
                }
                $scope.discountPrice += $scope.$parent.currStore.distributePrice;
            }

            /*拷贝订单副本用于提交*/
            var submitOrder = angular.copy($scope.$parent.order);
            /*如果取餐方式为配送,检查是否满足配送条件(满XX元才能配送、收货地址)*/
            if (submitOrder.takeType == 2) {
                if ($scope.$parent.currUserAddress && $scope.$parent.currUserAddress.addressId) {
                    submitOrder.addressId = $scope.$parent.currUserAddress.addressId;
                    if (submitOrder.price < $scope.$parent.currStore.distributeCost) {
                        $scope.discountList = [];
                        $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                        return;
                    }
                }
                else {
                    $scope.discountList = [];
                    $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                    return;
                }
            }
            else if (submitOrder.takeType == 3) {/*如果取餐方式为团餐,检查是否满足团餐条件(参团地址)*/
                if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId) {
                    submitOrder.businessAddressId = $scope.$parent.currBusiness.addressId;
                    submitOrder.businessCode = $scope.$parent.currBusiness.businessCode;
                    submitOrder.mealInfoId = $scope.mealInfoId
                }
                else {
                    $scope.discountList = [];
                    $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                    return;
                }
            }
            /*是否使用了优惠券*/
            if ($scope.$parent.currCoupons) {
                submitOrder.couponsId = $scope.$parent.currCoupons.couponsId;
            }
            /*判断是否存在手机号*/
            if(!submitOrder.cellPhone || !/^1[\d]{10}$/.test(submitOrder.cellPhone)){
                $scope.discountList = [];
                $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                return;
            }
            /*设置订单门店ID*/
            submitOrder.storeId = $scope.$parent.currStore.storeId;

            $http.post("/order/calculateOrder",submitOrder).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.discountList = data.data.list;
                    $scope.$parent.order.price = data.data.total;
                }
                else{
                    $scope.discountList = [];
                    $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                }
            });
        };
        /*切换取餐方式时执行的函数*/
        $scope.changeTakeType = function () {
            var dateList, timeList;
            /*根据当前餐品餐别设置取餐时间*/
            $scope.$parent.mealInfoList.forEach(function (mealInfo) {
                if (mealInfo.itemList.length > 0 && mealInfo.itemList.some(function (item) {
                        return (item.checked)
                    })) {
                    timeList = angular.copy(mealInfo.mealTimeItemList);
                    /*设置订单餐别*/
                    $scope.$parent.order.mealInfoId = mealInfo.id;
                    /*拷贝餐别副本,用于后续界面团餐截至时间*/
                    $scope.mealInfoId = mealInfo.id;
                }
            });
            /*当前餐别为自提、配送时,设置取餐日期,格式化输出时间选择控件数据源.餐别为团餐时,清空当前合作企业信息并将时间选择控件数据源清空(该数据源的日期和时间由合作企业对象提供)*/
            if ($scope.$parent.order.takeType != 3) {
                dateList = angular.copy($scope.$parent.dateList);
                timeList.forEach(function (item) {
                    item.valueName = item.value;
                    item.value = item.key;
                });
                $scope.$parent.lttimedate = ltTimeSet.getTimeFn(dateList, timeList);
                /*如果该门店存在默认地址*/
                if($scope.$parent.currStore.defaultAddress && !$scope.$parent.currUserAddress){
                    $scope.$parent.currUserAddress = $scope.$parent.currStore.defaultAddress;
                }
            }
            else {
                $scope.$parent.currBusiness = null;
                $scope.$parent.lttimedate = [];
            }
            /*设置页面日期和时间的默认值*/
            if ($scope.$parent.lttimedate.length > 0) {
                $scope.$parent.exchangeDate = $scope.$parent.lttimedate[0].valueName;
                $scope.$parent.order.distributionDate = $scope.$parent.lttimedate[0].value;
                $scope.$parent.exchangeTime = $scope.$parent.lttimedate[0].list[0].valueName;
                $scope.$parent.order.distributionTime = $scope.$parent.lttimedate[0].list[0].value;
            }
            else {
                $scope.$parent.exchangeDate = "";
                $scope.$parent.order.distributionDate = "";
                $scope.$parent.exchangeTime = "";
                $scope.$parent.order.distributionTime = "";
            }
            /*计算当前实付款*/
            $scope.calcOrderPrice();
        };
        /*每次进入结算页,重新执行该函数*/
        $scope.changeTakeType();

        /*订单提交函数*/
        $scope.submitOrder = function () {
            /*餐品费用(非实付款)小于0或正在支付中,返回*/
            if ($scope.$parent.shoppingCartTotalPrice < 0 || $scope.paying) {
                return;
            }
            /*拷贝订单副本用于提交*/
            var submitOrder = angular.copy($scope.$parent.order);
            /*如果取餐方式为配送,检查是否满足配送条件(满XX元才能配送、收货地址)*/
            if (submitOrder.takeType == 2) {
                if ($scope.$parent.currUserAddress && $scope.$parent.currUserAddress.addressId) {
                    submitOrder.addressId = $scope.$parent.currUserAddress.addressId;
                    if (submitOrder.price < $scope.$parent.currStore.distributeCost) {
                        $scope.showComnPopup({
                            message: "当前门店满" + $scope.$parent.currStore.distributeCost + "元配送!",
                            type: "toast"
                        });
                        return;
                    }
                }
                else {
                    $scope.showComnPopup({message: "请选择收货地址!", type: "toast"});
                    return;
                }
            }
            else if (submitOrder.takeType == 3) {/*如果取餐方式为团餐,检查是否满足团餐条件(参团地址)*/
                if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId) {
                    submitOrder.businessAddressId = $scope.$parent.currBusiness.addressId;
                    submitOrder.businessCode = $scope.$parent.currBusiness.businessCode;
                    submitOrder.mealInfoId = $scope.mealInfoId
                }
                else {
                    $scope.showComnPopup({message: "请选择参团地址!", type: "toast"});
                    return;
                }
            }
            /*是否使用了优惠券*/
            if ($scope.$parent.currCoupons) {
                submitOrder.couponsId = $scope.$parent.currCoupons.couponsId;
            }
            /*判断是否存在手机号*/
            if(!submitOrder.cellPhone || !/^1[\d]{10}$/.test(submitOrder.cellPhone)){
                $scope.showComnPopup({message: "请输入正确的手机号码!", type: "toast"});
                return;
            }
            /*设置订单门店ID*/
            submitOrder.storeId = $scope.$parent.currStore.storeId;
            /*设置支付中Flag*/
            $scope.showComnPopup({message: "支付中...", type: "toast"});
            $scope.paying = true;
            /*发起订单提交请求*/
            $http.post("/order/submitOrder", submitOrder).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {/*正常订单走微信支付*/
                    var config = angular.fromJson(data.data.payConfig);
                    config.success = function (res) {
                        var parms = {type: "prePay_Id", data: data.data.prePay_Id};
                        $scope.getOrderInfo(parms);
                    };
                    config.fail = function (res) {
                        $timeout(function () {
                            $scope.showComnPopup({message: "网络繁忙,请重试!", type: "alert"});
                            $scope.paying = false;
                            $http.post("/index/requestError", {errorUrl: location.origin + "/order/submitOrder",errorRequest: angular.toJson(submitOrder),errorResponse:data.data.payConfig || angular.toJson(config),errorMessage:angular.toJson(res)});
                        }, 0);
                    };
                    config.cancel = function (res) {
                        /*发请求取消订单*/
                        $timeout(function () {
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
                }
                else if (data.statusCode == 1) {/*0元支付订单*/
                    var parms = {type: "orderCode", data: data.data.orderCode};
                    $scope.getOrderInfo(parms);
                }
                else {
                    $scope.showComnPopup({message: data.statusMessage, type: "alert"});
                    $scope.paying = false;
                }
            }).error(function (data, status, headers, config) {
                if (status == 0) {
                    payError++;
                    if (payError <= 3) {
                        $scope.submitOrder();
                    }
                    else {
                        $scope.showComnPopup({
                            message: "当前网络异常,请重试!", type: "alert", alert: function () {
                                $scope.paying = false;
                                payError = 0;
                            }
                        });
                    }
                }
                else {
                    $scope.showComnPopup({
                        message: "errorStatus:" + status + " errorData:" + angular.toJson(data),
                        type: "alert"
                    });
                    $scope.paying = false;
                }
            });
        };
        /*通过prePay_Id或orderCode获取订单对象*/
        $scope.getOrderInfo = function (parms) {
            var sUrl = "/order/getUUID?" + parms.type + "=" + parms.data;
            /*获取订单信息,清空选择的优惠券、合作企业、用户地址信息,跳转至订单详情页*/
            $http.get(sUrl).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.paying = false;
                    $scope.$parent.currCoupons = {};
                    $scope.$parent.currBusiness = {};
                    $scope.$parent.currAddress = {};
                    $scope.go("order-detail", {
                        orderInfo: data.data,
                        orderId: data.data.orderId,
                        from: "pay"
                    });
                }
            }).error(function (data, status, headers, config) {
                $scope.getOrderInfo(parms);
            });
        };
        /*选择取餐日期和时间*/
        $scope.timePickerShowFn = function () {
            if ($scope.$parent.order.takeType == 3 && !$scope.$parent.currBusiness) {
                $scope.showComnPopup({message: "请选择参团地址!", type: "toast"});
                return;
            }
            $timeout(function () {
                var config = {
                    dataSource: $scope.$parent.lttimedate,
                    activeIndexList: [$scope.$parent.order.distributionDate, $scope.$parent.order.distributionTime]
                };
                config.success = function (res) {/*确定按钮回调函数,设置选中的日期和时间*/
                    $scope.$parent.exchangeDate = res[0].valueName;
                    $scope.$parent.order.distributionDate = res[0].value;
                    $scope.$parent.exchangeTime = res[1].valueName;
                    $scope.$parent.order.distributionTime = res[1].value;
                    /*如果当前餐品餐别为全时段,团餐截止时间将会根据选择的时间实时更新*/
                    if ($scope.$parent.order.mealInfoId == 1) {
                        for (var key in $scope.$parent.TakeType3.distributionTime) {
                            if ($scope.$parent.TakeType3.distributionTime[key] == $scope.$parent.order.distributionTime) {
                                $scope.mealInfoId = key;
                            }
                        }
                    }
                };
                $scope.showMutilScrollPopup(config);
            }, 50)
        };
        /*输入企业团餐modal框*/
        $scope.showBusinessPopup = function () {
            $scope.tmpCode = {};
            $scope.businessPopup = $ionicPopup.show({
                template: "<input placeholder='请输入合作企业代码' type='tel' ng-model='tmpCode.businessCode'autofocus><i class='btn-close' ng-click='businessPopup.close()'></i>",
                scope: $scope,
                cssClass: "businessPopup",
                buttons: [
                    {
                        text: "<b>确定</b>",
                        onTap: function (e) {
                            return $scope.tmpCode.businessCode;
                        }
                    }
                ]
            });
            $scope.businessPopup.then(function (res) {
                if (!res) {

                }
                else if (!angular.isNumber(Number(res))) {
                    $scope.showComnPopup({message: "请输入6位企业合作代码!", type: "toast"});
                }
                else {
                    $http.post("/order/checkBusinessCode", {
                        storeId: $scope.currStore.storeId,
                        businessCode: res
                    }).success(function (data, status, headers, config) {
                        if (data.statusCode == 0) {
                            /*当前合作企业地址List*/
                            if (data.data.enterpriseAddressList.length > 0) {
                                /*保存当前合作企业 时间选择数据源*/
                                $scope.$parent.TakeType3.distributionTime = data.data.distributionTime;
                                /*保存合作企业的折扣*/
                                $scope.$parent.TakeType3.discount = data.data.discount / 100;
                                /*如果合作企业地址只有一个不显示地址选择界面*/
                                if (data.data.enterpriseAddressList.length == 1) {
                                    $scope.useBusinessAddressModal(data.data.enterpriseAddressList[0])
                                }
                                else {
                                    $scope.businessAddressList = data.data.enterpriseAddressList;
                                    $scope.businessAddressModal.show();
                                }
                            }
                        }
                        else {
                            $scope.showComnPopup({message: data.statusMessage, type: "alert"});
                        }
                    });
                }
            });
        };
        $ionicModal.fromTemplateUrl("businessAddress.html", {
            scope: $scope,
            animation: "slide-in-left"
        }).then(function (modal) {
            $scope.businessAddressModal = modal;
        });
        /*选择参团地址*/
        $scope.useBusinessAddressModal = function (item) {
            $scope.$parent.currBusiness = item;
            var dateList, timeList;

            dateList = angular.copy($scope.$parent.dateList);
            dateList.forEach(function (item) {
                item.valueName = item.chineseDate + "(" + item.sequence + ")";
                item.value = item.date;
            });
            /*如果当前餐别为全时段,早中晚时段都可选*/
            if ($scope.$parent.order.mealInfoId == 1) {
                timeList = [];
                if ($scope.$parent.TakeType3.distributionTime[2]) {
                    timeList.push($scope.distributionTime[$scope.$parent.TakeType3.distributionTime[2]]);
                }
                if ($scope.$parent.TakeType3.distributionTime[3]) {
                    timeList.push($scope.distributionTime[$scope.$parent.TakeType3.distributionTime[3]]);
                }
                if ($scope.$parent.TakeType3.distributionTime[4]) {
                    timeList.push($scope.distributionTime[$scope.$parent.TakeType3.distributionTime[4]]);
                }
            }
            else {
                /*判断当前参团地址是否支持配送*/
                if ($scope.$parent.TakeType3.distributionTime[$scope.$parent.order.mealInfoId]) {
                    timeList = [$scope.distributionTime[$scope.$parent.TakeType3.distributionTime[$scope.$parent.order.mealInfoId]]];
                }
                else {
                    $scope.showComnPopup({message: "当前餐别不支持配送!", type: "toast"});
                    return;
                }
            }
            /*生成当前参团地址对应的时间选择数据源*/
            $scope.$parent.lttimedate = ltTimeSet.getTimeFn(dateList, timeList);
            /*设置日期和时间默认值*/
            $scope.$parent.exchangeDate = $scope.$parent.lttimedate[0].valueName;
            $scope.$parent.order.distributionDate = $scope.$parent.lttimedate[0].value;
            $scope.$parent.exchangeTime = $scope.$parent.lttimedate[0].list[0].valueName;
            $scope.$parent.order.distributionTime = $scope.$parent.lttimedate[0].list[0].value;
            /*如果是全时段餐品,重置当前餐别ID*/
            if ($scope.$parent.order.mealInfoId == 1) {
                for (var key in $scope.$parent.TakeType3.distributionTime) {
                    if ($scope.$parent.TakeType3.distributionTime[key] == $scope.$parent.order.distributionTime) {
                        $scope.mealInfoId = key;
                    }
                }
            }
            /*计算实付款*/
            $scope.calcOrderPrice();
            /*关闭参团地址modal*/
            if ($scope.businessAddressModal.isShown()) {
                $scope.businessAddressModal.hide();
            }
        };
        /*关闭参团地址modal*/
        $scope.closeBusinessAddressModal = function () {
            $scope.businessAddressModal.hide();
        };
        /*暂时使用*/
        $ionicModal.fromTemplateUrl("coupons.html", {
            scope: $scope,
            animation: "slide-in-left"
        }).then(function (modal) {
            $scope.couponsModal = modal;
        });
        $scope.closeCouponsModal = function () {
            $scope.couponsModal.hide();
        };
        $scope.openCouponsModal = function () {
            $http.post("/coupons/getCouponsList", {test: 1}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    var nowTick = new Date().getTime();
                    $scope.couponsList = data.data.filter(function (coupons) {
                        //if (coupons.stores) {
                        //    coupons.stores = "," + coupons.stores + ",";
                        //}
                        //if (coupons.commodities) {
                        //    coupons.commodities = "," + coupons.commodities + ",";
                        //}
                        ///*判断条件 (优惠券门店为空 || 优惠券门店列表中包含当前门店) && 优惠券有效期包含当前时间 && 优惠券状态为未使用 && （优惠券商品列表中包含当前购物车商品 || 优惠券商品列表为空)*/
                        //if (coupons.starttime <= nowTick && nowTick <= coupons.endtime && coupons.status == 1 && (!coupons.stores || (coupons.stores.indexOf("," + $scope.$parent.currStore.storeId + ",") >= 0))) {
                        //    return $scope.$parent.shoppingCart.filter(function (item) {
                        //        /*筛选出所有选中的商品(有可能购物车中存在其他互斥餐别的商品)*/
                        //        return (item.checked)
                        //    }).some(function (item) {
                        //        /*筛选出 商品列表中包含当前购物车商品 || 优惠券商品列表为空(未限制可使用商品) 的优惠券*/
                        //        return (!coupons.commodities || coupons.commodities.indexOf("," + item.commodityId + ",") >= 0)
                        //    })
                        //}
                        //else {
                        //    return false;
                        //}

                        /*所有未使用的优惠券都可以显示,点击使用具体某张优惠券时再判断是否满足其他条件*/
                        return (nowTick <= coupons.endtime && coupons.status == 1);
                    });
                    $scope.couponsList.forEach(function (item) {
                        item.displayTime = $filter("date")(item.starttime, "yyyy-MM-dd") + "~" + $filter("date")(item.endtime, "yyyy-MM-dd");
                        if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId == item.couponsId) {
                            item.checked = true;
                        }
                    });
                    $scope.couponsModal.show();
                }
            });
        };
        /*使用选中的优惠券*/
        $scope.useCoupons = function (coupons) {
            var nowTick = new Date().getTime();
            /*这里检查优惠券能否被使用的条件*/
            if (coupons.stores && coupons.stores.indexOf(",") != 0) {
                coupons.stores = "," + coupons.stores + ",";
            }
            if (coupons.commodities && coupons.commodities.indexOf(",") != 0) {
                coupons.commodities = "," + coupons.commodities + ",";
            }

            var couponsErrMsg = "";
            /*检查优惠券的使用日期区间*/
            if(coupons.starttime > nowTick){
                couponsErrMsg = "当前优惠券未到使用期!";
            }
            if(couponsErrMsg.length == 0 && nowTick > coupons.endtime){
                couponsErrMsg = "当前优惠券已过期!";
            }
            if(couponsErrMsg.length == 0 && coupons.status != 1){
                couponsErrMsg = "当前优惠券状态异常!";
            }
            if(couponsErrMsg.length == 0 && coupons.stores && coupons.stores.indexOf("," + $scope.$parent.currStore.storeId + ",") < 0){
                couponsErrMsg = "当前优惠券可用门店不包含当前门店!";
            }
            if(couponsErrMsg.length == 0 && !$scope.$parent.shoppingCart.filter(function (item) {
                    /*筛选出所有选中的商品(有可能购物车中存在其他互斥餐别的商品)*/
                    return (item.checked)
                }).some(function (item) {
                    /*筛选出 商品列表中包含当前购物车商品 || 优惠券商品列表为空(未限制可使用商品) 的优惠券*/
                    return (!coupons.commodities || coupons.commodities.indexOf("," + item.commodityId + ",") >= 0)
                })){
                couponsErrMsg = "当前优惠券可用商品不支持当前所选商品!!";
            }
            if($scope.$parent.shoppingCartTotalPrice < coupons.costPrice){
                couponsErrMsg = "当前优惠券必须满"+ coupons.costPrice +"元才可使用!";
            }
            if(couponsErrMsg.length > 0){
                $scope.showComnPopup({message: couponsErrMsg, type: "toast"});
                return;
            }

            coupons.checked = true;
            $scope.$parent.currCoupons = coupons;
            $scope.calcOrderPrice();
            $scope.closeCouponsModal();
        };
        /*不使用优惠券*/
        $scope.noUseCoupons = function () {
            /*当前优惠券对象置空*/
            $scope.$parent.currCoupons = null;
            $scope.calcOrderPrice();
            $scope.closeCouponsModal();
        };
    });
}]);
/**
 * Created by cjd on 2016/1/27.
 */
angular.module("xsyh").controller("posScanCtrl", ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {
    $scope.$on("initPosScan", function (event) {
        $scope.initPosScan();
    });
    $scope.initPosScan = function () {
        $scope.$parent.currStore = $scope.$parent.storeList.filter(function (item, index, array) {
            return (item.storeId == $stateParams.storeId)
        })[0];
        if($stateParams.orderNumber){
            $scope.orderNumber = $stateParams.orderNumber;
            $scope.getOrderInfoByOrderNumber();
        }
    };
    $scope.getOrderInfoByOrderNumber = function () {
        $http.post("/order/findOrderByNumber", {
            storeId: $scope.$parent.currStore.storeId,
            orderNumber: $scope.orderNumber
        }).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                if(data.data){
                    var parms = {orderInfo: data.data, from: "posScan"};
                    if(data.data.orderId){
                        parms.orderId = data.data.orderId
                    }
                    $scope.go("order-detail",parms);
                }
                else{
                    $scope.showComnPopup({message: "订单不存在!", type: "alert"});
                }
            }
            else {
                $scope.showComnPopup({message: data.statusMessage, type: "alert"});
            }
        })
    };

    if ($scope.$parent.totalCommodityList.length > 0) {
        $scope.initPosScan();
    }
}]);
/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("shoppingCartCtrl", ["$scope", "$http", "$timeout", "$ionicScrollDelegate", "$ionicModal", function ($scope, $http, $timeout, $ionicScrollDelegate, $ionicModal) {
    $scope.$on("$ionicView.enter",function(){
        /*设置底部导航栏索引*/
        $scope.$parent.currFooterMenu = 2;
        if ($scope.$parent.shoppingCart.length > 0) {
            /*刷新购物车*/
            $scope.refreshCart = function (currItem) {
                if (currItem.checked) {
                    currItem.itemList.forEach(function (item) {
                        item.checked = true;
                    });
                    if (currItem.id != 1) {
                        $scope.$parent.mealInfoList.forEach(function (mealInfo) {
                            if (mealInfo.id != currItem.id && mealInfo.id != 1) {
                                mealInfo.checked = false;
                                mealInfo.itemList.forEach(function (item) {
                                    item.checked = false;
                                });
                            }
                        });
                    }
                }
                else {
                    currItem.itemList.forEach(function (item) {
                        item.checked = false;
                    });
                }
            };
            /*删除全部商品*/
            $scope.deleteAll = function(){
                if($scope.$parent.shoppingCart.length > 0){
                    var config = {title: "是否确认删除全部餐品?", type: "confirm"};
                    config.confirm = function () {
                        $scope.$parent.shoppingCart.forEach(function(item){
                            item.count = 0;
                        });
                        $scope.$parent.shoppingCart = [];
                        $scope.$parent.mealInfoList.forEach(function (mealInfo, index, array) {
                            mealInfo.itemList = [];
                        });
                        $ionicScrollDelegate.$getByHandle("shoppingCartContent").scrollTop(false);
                    };
                    $scope.showComnPopup(config);
                }
            };
        }
    })
}]);
/**
 * Created by cjd on 2016/2/18.
 */
angular.module("xsyh").controller("storeCtrl", ["$scope", "$ionicScrollDelegate", "$timeout", "$http","$stateParams", function ($scope, $ionicScrollDelegate, $timeout, $http,$stateParams) {
    $scope.$on("$ionicView.enter",function(){
    });
    $scope.getNearbyStore = function (lbs) {
        $http.post("/store/nearby", {
            lat: lbs.latitude,
            lng: lbs.longitude
        }).success(function (data, status, headers, config) {
            if (data.statusCode == 0) {
                $scope.nearbyStoreList = [];
                data.data.forEach(function(item){
                    for (var i = 0; i < $scope.$parent.storeList; i++) {
                        if(item.storeId == $scope.$parent.storeList[i].storeId){
                            $scope.$parent.storeList[i].distance = item.distance;
                            $scope.nearbyStoreList.push($scope.$parent.storeList[i]);
                            break
                        }
                    }
                })
            }
            else {
                $scope.showComnPopup({message: data.statusMessage, type: "alert"});
            }
        })
    };
}]);
!function(a,b){"function"==typeof define&&(define.amd||define.cmd)?define(function(){return b(a)}):b(a,!0)}(this,function(a,b){function c(b,c,d){a.WeixinJSBridge?WeixinJSBridge.invoke(b,e(c),function(a){g(b,a,d)}):j(b,d)}function d(b,c,d){a.WeixinJSBridge?WeixinJSBridge.on(b,function(a){d&&d.trigger&&d.trigger(a),g(b,a,c)}):d?j(b,d):j(b,c)}function e(a){return a=a||{},a.appId=E.appId,a.verifyAppId=E.appId,a.verifySignType="sha1",a.verifyTimestamp=E.timestamp+"",a.verifyNonceStr=E.nonceStr,a.verifySignature=E.signature,a}function f(a){return{timeStamp:a.timestamp+"",nonceStr:a.nonceStr,"package":a.package,paySign:a.paySign,signType:a.signType||"SHA1"}}function g(a,b,c){var d,e,f;switch(delete b.err_code,delete b.err_desc,delete b.err_detail,d=b.errMsg,d||(d=b.err_msg,delete b.err_msg,d=h(a,d),b.errMsg=d),c=c||{},c._complete&&(c._complete(b),delete c._complete),d=b.errMsg||"",E.debug&&!c.isInnerInvoke&&alert(JSON.stringify(b)),e=d.indexOf(":"),f=d.substring(e+1)){case"ok":c.success&&c.success(b);break;case"cancel":c.cancel&&c.cancel(b);break;default:c.fail&&c.fail(b)}c.complete&&c.complete(b)}function h(a,b){var e,f,c=a,d=p[c];return d&&(c=d),e="ok",b&&(f=b.indexOf(":"),e=b.substring(f+1),"confirm"==e&&(e="ok"),"failed"==e&&(e="fail"),-1!=e.indexOf("failed_")&&(e=e.substring(7)),-1!=e.indexOf("fail_")&&(e=e.substring(5)),e=e.replace(/_/g," "),e=e.toLowerCase(),("access denied"==e||"no permission to execute"==e)&&(e="permission denied"),"config"==c&&"function not exist"==e&&(e="ok"),""==e&&(e="fail")),b=c+":"+e}function i(a){var b,c,d,e;if(a){for(b=0,c=a.length;c>b;++b)d=a[b],e=o[d],e&&(a[b]=e);return a}}function j(a,b){if(!(!E.debug||b&&b.isInnerInvoke)){var c=p[a];c&&(a=c),b&&b._complete&&delete b._complete,console.log('"'+a+'",',b||"")}}function k(){0!=D.preVerifyState&&(u||v||E.debug||"6.0.2">z||D.systemType<0||A||(A=!0,D.appId=E.appId,D.initTime=C.initEndTime-C.initStartTime,D.preVerifyTime=C.preVerifyEndTime-C.preVerifyStartTime,H.getNetworkType({isInnerInvoke:!0,success:function(a){var b,c;D.networkType=a.networkType,b="http://open.weixin.qq.com/sdk/report?v="+D.version+"&o="+D.preVerifyState+"&s="+D.systemType+"&c="+D.clientVersion+"&a="+D.appId+"&n="+D.networkType+"&i="+D.initTime+"&p="+D.preVerifyTime+"&u="+D.url,c=new Image,c.src=b}})))}function l(){return(new Date).getTime()}function m(b){w&&(a.WeixinJSBridge?b():q.addEventListener&&q.addEventListener("WeixinJSBridgeReady",b,!1))}function n(){H.invoke||(H.invoke=function(b,c,d){a.WeixinJSBridge&&WeixinJSBridge.invoke(b,e(c),d)},H.on=function(b,c){a.WeixinJSBridge&&WeixinJSBridge.on(b,c)})}var o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;if(!a.jWeixin)return o={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest"},p=function(){var b,a={};for(b in o)a[o[b]]=b;return a}(),q=a.document,r=q.title,s=navigator.userAgent.toLowerCase(),t=navigator.platform.toLowerCase(),u=!(!t.match("mac")&&!t.match("win")),v=-1!=s.indexOf("wxdebugger"),w=-1!=s.indexOf("micromessenger"),x=-1!=s.indexOf("android"),y=-1!=s.indexOf("iphone")||-1!=s.indexOf("ipad"),z=function(){var a=s.match(/micromessenger\/(\d+\.\d+\.\d+)/)||s.match(/micromessenger\/(\d+\.\d+)/);return a?a[1]:""}(),A=!1,B=!1,C={initStartTime:l(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},D={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",preVerifyState:1,systemType:y?1:x?2:-1,clientVersion:z,url:encodeURIComponent(location.href)},E={},F={_completes:[]},G={state:0,data:{}},m(function(){C.initEndTime=l()}),H={config:function(a){E=a,j("config",a);var b=E.check===!1?!1:!0;m(function(){var a,d,e;if(b)c(o.config,{verifyJsApiList:i(E.jsApiList)},function(){F._complete=function(a){C.preVerifyEndTime=l(),G.state=1,G.data=a},F.success=function(){D.preVerifyState=0},F.fail=function(a){F._fail?F._fail(a):G.state=-1};var a=F._completes;return a.push(function(){k()}),F.complete=function(){for(var c=0,d=a.length;d>c;++c)a[c]();F._completes=[]},F}()),C.preVerifyStartTime=l();else{for(G.state=1,a=F._completes,d=0,e=a.length;e>d;++d)a[d]();F._completes=[]}}),E.beta&&n()},ready:function(a){0!=G.state?a():(F._completes.push(a),!w&&E.debug&&a())},error:function(a){"6.0.2">z||B||(B=!0,-1==G.state?a(G.data):F._fail=a)},checkJsApi:function(a){var b=function(a){var c,d,b=a.checkResult;for(c in b)d=p[c],d&&(b[d]=b[c],delete b[c]);return a};c("checkJsApi",{jsApiList:i(a.jsApiList)},function(){return a._complete=function(a){if(x){var c=a.checkResult;c&&(a.checkResult=JSON.parse(c))}a=b(a)},a}())},onMenuShareTimeline:function(a){d(o.onMenuShareTimeline,{complete:function(){c("shareTimeline",{title:a.title||r,desc:a.title||r,img_url:a.imgUrl||"",link:a.link||location.href,type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareAppMessage:function(a){d(o.onMenuShareAppMessage,{complete:function(){c("sendAppMessage",{title:a.title||r,desc:a.desc||"",link:a.link||location.href,img_url:a.imgUrl||"",type:a.type||"link",data_url:a.dataUrl||""},a)}},a)},onMenuShareQQ:function(a){d(o.onMenuShareQQ,{complete:function(){c("shareQQ",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareWeibo:function(a){d(o.onMenuShareWeibo,{complete:function(){c("shareWeiboApp",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},onMenuShareQZone:function(a){d(o.onMenuShareQZone,{complete:function(){c("shareQZone",{title:a.title||r,desc:a.desc||"",img_url:a.imgUrl||"",link:a.link||location.href},a)}},a)},startRecord:function(a){c("startRecord",{},a)},stopRecord:function(a){c("stopRecord",{},a)},onVoiceRecordEnd:function(a){d("onVoiceRecordEnd",a)},playVoice:function(a){c("playVoice",{localId:a.localId},a)},pauseVoice:function(a){c("pauseVoice",{localId:a.localId},a)},stopVoice:function(a){c("stopVoice",{localId:a.localId},a)},onVoicePlayEnd:function(a){d("onVoicePlayEnd",a)},uploadVoice:function(a){c("uploadVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadVoice:function(a){c("downloadVoice",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},translateVoice:function(a){c("translateVoice",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},chooseImage:function(a){c("chooseImage",{scene:"1|2",count:a.count||9,sizeType:a.sizeType||["original","compressed"],sourceType:a.sourceType||["album","camera"]},function(){return a._complete=function(a){if(x){var b=a.localIds;b&&(a.localIds=JSON.parse(b))}},a}())},previewImage:function(a){c(o.previewImage,{current:a.current,urls:a.urls},a)},uploadImage:function(a){c("uploadImage",{localId:a.localId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},downloadImage:function(a){c("downloadImage",{serverId:a.serverId,isShowProgressTips:0==a.isShowProgressTips?0:1},a)},getNetworkType:function(a){var b=function(a){var c,d,e,b=a.errMsg;if(a.errMsg="getNetworkType:ok",c=a.subtype,delete a.subtype,c)a.networkType=c;else switch(d=b.indexOf(":"),e=b.substring(d+1)){case"wifi":case"edge":case"wwan":a.networkType=e;break;default:a.errMsg="getNetworkType:fail"}return a};c("getNetworkType",{},function(){return a._complete=function(a){a=b(a)},a}())},openLocation:function(a){c("openLocation",{latitude:a.latitude,longitude:a.longitude,name:a.name||"",address:a.address||"",scale:a.scale||28,infoUrl:a.infoUrl||""},a)},getLocation:function(a){a=a||{},c(o.getLocation,{type:a.type||"wgs84"},function(){return a._complete=function(a){delete a.type},a}())},hideOptionMenu:function(a){c("hideOptionMenu",{},a)},showOptionMenu:function(a){c("showOptionMenu",{},a)},closeWindow:function(a){a=a||{},c("closeWindow",{},a)},hideMenuItems:function(a){c("hideMenuItems",{menuList:a.menuList},a)},showMenuItems:function(a){c("showMenuItems",{menuList:a.menuList},a)},hideAllNonBaseMenuItem:function(a){c("hideAllNonBaseMenuItem",{},a)},showAllNonBaseMenuItem:function(a){c("showAllNonBaseMenuItem",{},a)},scanQRCode:function(a){a=a||{},c("scanQRCode",{needResult:a.needResult||0,scanType:a.scanType||["qrCode","barCode"]},function(){return a._complete=function(a){var b,c;y&&(b=a.resultStr,b&&(c=JSON.parse(b),a.resultStr=c&&c.scan_code&&c.scan_code.scan_result))},a}())},openProductSpecificView:function(a){c(o.openProductSpecificView,{pid:a.productId,view_type:a.viewType||0,ext_info:a.extInfo},a)},addCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,card_ext:g.cardExt},d.push(h);c(o.addCard,{card_list:d},function(){return a._complete=function(a){var c,d,e,b=a.card_list;if(b){for(b=JSON.parse(b),c=0,d=b.length;d>c;++c)e=b[c],e.cardId=e.card_id,e.cardExt=e.card_ext,e.isSuccess=e.is_succ?!0:!1,delete e.card_id,delete e.card_ext,delete e.is_succ;a.cardList=b,delete a.card_list}},a}())},chooseCard:function(a){c("chooseCard",{app_id:E.appId,location_id:a.shopId||"",sign_type:a.signType||"SHA1",card_id:a.cardId||"",card_type:a.cardType||"",card_sign:a.cardSign,time_stamp:a.timestamp+"",nonce_str:a.nonceStr},function(){return a._complete=function(a){a.cardList=a.choose_card_info,delete a.choose_card_info},a}())},openCard:function(a){var e,f,g,h,b=a.cardList,d=[];for(e=0,f=b.length;f>e;++e)g=b[e],h={card_id:g.cardId,code:g.code},d.push(h);c(o.openCard,{card_list:d},a)},chooseWXPay:function(a){c(o.chooseWXPay,f(a),a)}},b&&(a.wx=a.jWeixin=H),H});