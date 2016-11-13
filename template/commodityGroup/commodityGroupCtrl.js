/**
 * Created by cjd on 2016/3/8.
 */
angular.module("xsyh").controller("commodityGroupCtrl", ["$scope", "$http", "$stateParams", "$interval", "$ionicBackdrop","$q", function ($scope, $http, $stateParams, $interval, $ionicBackdrop,$q) {
    $scope.$on("$ionicView.leave", function () {
        if ($scope.$parent.activityInfo.showShareMask) {
            $scope.$parent.activityInfo.showShareMask = false;
        }
        if ($scope.timer) {
            $interval.cancel($scope.timer)
        }
    });

    var groupInit = {deferred: $q.defer()};
    groupInit.promise = groupInit.deferred.promise;
    $scope.$parent.shareToPromiseList.push(groupInit.promise);
    $q.all($scope.$parent.shareToPromiseList).then(function (result) {
        $scope.shareTo();
    }, function (error) {
        alert("Fail: " + error);
    });

    $scope.initCommodityGroup = function () {
        /*获取分享用户ID*/
        if(location.hash.indexOf("shareMemberInfoId") >= 0){
            $scope.$parent.order.shareMemberInfoId = location.hash.replace(/.*[\?|\&]shareMemberInfoId\=([^\&]*)\&?.*/, "$1");
        }
        if($stateParams.activityId){
            $scope.$parent.order.shareActivityId = $stateParams.activityId;
            /*通过活动ID获取活动信息*/
            $http.post("/activities/findActivity", {activityId: $stateParams.activityId}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.$parent.activityInfo = data.data;

                    var commodityId = $scope.$parent.activityInfo.commodityId;
                    $scope.$parent.activityInfo.commodity = $scope.$parent.totalCommodityList.filter(function (item) {
                        return (item.commodityId == commodityId)
                    })[0];
                    if(!$scope.$parent.activityInfo.commodity){
                        $scope.showComnPopup({
                            message: "团购商品暂未上架", type: "alert", alert: function () {
                                $scope.go("home");
                            }
                        });
                    }
                    /*判断当前门店是否合法*/
                    $scope.$parent.activityInfo.storeInfo = $scope.$parent.storeList.filter(function (item) {
                        return (item.storeId == $scope.$parent.currStore.storeId)
                    })[0];
                    /*判断活动时间*/
                    $scope.cd = Math.floor(($scope.$parent.activityInfo.endtime - new Date().getTime()) / 1000);
                    $scope.CD = function () {
                        var cd = $scope.cd;
                        $scope.$parent.activityInfo.CDHours = Math.floor(cd / 3600);
                        $scope.$parent.activityInfo.CDMinute = Math.floor((cd - 3600 * $scope.$parent.activityInfo.CDHours) / 60);
                        $scope.$parent.activityInfo.CDSecond = Math.ceil(cd - 3600 * $scope.$parent.activityInfo.CDHours - 60 * $scope.$parent.activityInfo.CDMinute);
                        if ($scope.$parent.activityInfo.CDSecond == 60) {
                            $scope.$parent.activityInfo.CDMinute++;
                            $scope.$parent.activityInfo.CDSecond = 0;
                        }
                        if ($scope.$parent.activityInfo.CDHours < 10) {
                            $scope.$parent.activityInfo.CDHours = "0" + $scope.$parent.activityInfo.CDHours;
                        }
                        if ($scope.$parent.activityInfo.CDMinute < 10) {
                            $scope.$parent.activityInfo.CDMinute = "0" + $scope.$parent.activityInfo.CDMinute;
                        }
                        if ($scope.$parent.activityInfo.CDSecond < 10) {
                            $scope.$parent.activityInfo.CDSecond = "0" + $scope.$parent.activityInfo.CDSecond;
                        }
                        $scope.cd--
                    };

                    if ($scope.cd <= 0) {
                        $scope.$parent.activityInfo.CDHours = "00";
                        $scope.$parent.activityInfo.CDMinute = "00";
                        $scope.$parent.activityInfo.CDSecond = "00";
                        $scope.showComnPopup({
                            message: "团购活动已结束", type: "alert", alert: function () {
                                $scope.go("home");
                            }
                        });
                    }
                    else {
                        if ($scope.$parent.activityInfo.starttime <= new Date().getTime()) {
                            $scope.timer = $interval(function () {
                                $scope.CD();
                            }, 1000);
                            $scope.CD();

                            groupInit.deferred.resolve("loaded!");
                        }
                        else {
                            $scope.showComnPopup({
                                message: "团购活动还未开始!", type: "alert", alert: function () {
                                    $scope.go("home");
                                }
                            });
                        }
                    }
                }
            });
        }
        else{
            $scope.showComnPopup({
                message: "活动ID不存在!", type: "alert", alert: function () {
                    $scope.go("home");
                }
            });
        }
    };
    if ($scope.$parent.totalCommodityList.length > 0) {
        $scope.initCommodityGroup();
    }
    $scope.$on("initCommodityGroup", function (event) {
        $scope.initCommodityGroup();
    });

    /*分享至朋友圈和朋友*/
    $scope.shareTo = function (type) {
        var shareLink = location.origin + "/index/indexpage?type=70&shareMemberInfoId=" + $scope.$parent.userInfo.memberInfoId + "&storeId=" + $scope.$parent.activityInfo.storeInfo.storeId + "&activityId=" + $scope.$parent.activityInfo.activityId;
        var title = $scope.$parent.activityInfo.commodity.promotion + "元|" + $scope.$parent.activityInfo.name;
        var imgUrl = $scope.imgRoot + $scope.$parent.activityInfo.commodity.commodityBigImg;
        if (type) {
            $scope.$parent.activityInfo.showShareMask = true;
        }
        else{
            //朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                link: shareLink, // 分享链接       (用户ID+门店ID+活动ID)
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            /*朋友圈*/
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: shareLink, // 分享链接       (用户ID+门店ID+活动ID)
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    };
}]);