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