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