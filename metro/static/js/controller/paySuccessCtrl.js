angular.module("xs1h").controller("paySuccessCtrl",['$stateParams',"$scope", function($stateParams,$scope) {
   console.log($stateParams);
   $scope.orderNumber=$stateParams.orderNumber;
}]);