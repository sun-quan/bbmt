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