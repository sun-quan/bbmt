/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("activityCtrl", ["$scope", "$http", "$stateParams", function ($scope, $http, $stateParams) {
    $scope.$on("initActivity", function (event) {
        $scope.initActivity();
    });
    $scope.initActivity = function () {
        if($stateParams.activityId){
            $http.post("/activities/findActivity", {activityId: $stateParams.activityId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.$parent.activityInfo.frameList = data.data.content;
                }
            });
        }
        else{
            $scope.showComnPopup({
                message: "活动ID不存在", type: "alert", alert: function () {
                    $scope.go("home");
                }
            });
        }
    };

    if ($scope.$parent.totalCommodityList.length > 0) {
        $scope.initActivity();
    }

    $scope.changeView = function (frameInfo,modelInfo) {
        if(frameInfo.frame == 1){/*1*1布局*/
            if(modelInfo.moduleType == 1 && modelInfo.value){/*URL*/
                location.href = modelInfo.value;
            }
            else if(modelInfo.moduleType == 2 && modelInfo.value){/*商品ID*/
                $scope.go("commodity-detail",{commodityId:modelInfo.value})
            }
        }
    };
}]);