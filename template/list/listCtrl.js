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