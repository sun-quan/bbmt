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