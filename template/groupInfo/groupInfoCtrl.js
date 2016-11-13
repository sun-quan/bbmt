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