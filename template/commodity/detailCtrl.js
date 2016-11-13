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