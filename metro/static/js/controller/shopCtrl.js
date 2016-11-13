angular.module("xs1h").controller("shopCtrl", ["$scope", "$state", "$http", "$timeout", '$ionicModal', "$rootScope", "$ionicLoading", "$ionicPopup", "$ionicScrollDelegate", "$ionicBackdrop", "$stateParams", function($scope, $state, $http, $timeout, $ionicModal, $rootScope, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicBackdrop, $stateParams) {
		$http.post('order/findOrderByNumber',$stateParams).success(function (data) {
		})
}]);