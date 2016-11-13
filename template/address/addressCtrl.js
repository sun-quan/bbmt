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