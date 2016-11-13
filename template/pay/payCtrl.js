/**
 * Created by cjd on 2015/12/18.
 */
angular.module("xsyh").controller("payCtrl", ["$scope", "$http", "$filter", "$timeout", "$ionicModal", "$ionicBackdrop", "ltTimeSet", "$ionicPopup", "$stateParams","$ionicHistory", function ($scope, $http, $filter, $timeout, $ionicModal, $ionicBackdrop, ltTimeSet, $ionicPopup, $stateParams,$ionicHistory) {
    /*监听页面离开事件,关闭modal对话框*/
    $scope.$on("$ionicView.leave", function (event) {
        if ($scope.businessPopup && $scope.businessPopup.close) {
            $scope.businessPopup.close();
        }
        if ($scope.businessAddressModal && $scope.businessAddressModal.isShown()) {
            $scope.businessAddressModal.remove();
        }
        if ($scope.couponsModal && $scope.couponsModal.isShown()) {
            $scope.couponsModal.remove();
        }
        if($scope.$parent.showMutilScroll){
            $scope.$parent.closeMutilScrollPopup();
        }
    });
    //$scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    //    $ionicHistory;
    //    if (fromState.name == "pay") {
    //        if(toState.name == "list"){
    //            if ($scope.businessPopup && $scope.businessPopup.close) {
    //                $scope.businessPopup.close();
    //                event.preventDefault();
    //            }
    //            if ($scope.businessAddressModal && $scope.businessAddressModal.isShown()) {
    //                $scope.businessAddressModal.remove();
    //                event.preventDefault();
    //            }
    //            if ($scope.couponsModal && $scope.couponsModal.isShown()) {
    //                $scope.couponsModal.remove();
    //                event.preventDefault();
    //            }
    //            if($scope.$parent.showMutilScroll){
    //                $scope.$parent.closeMutilScrollPopup();
    //                event.preventDefault();
    //            }
    //        }
    //    }
    //});
    $scope.$on("$ionicView.enter", function () {
        /*购物车为空,跳转至首页*/
        if ($scope.$parent.shoppingCart.length == 0) {
            location.href = "#/home";
            return;
        }
        /*获取上一个页面*/
        $scope.from = $stateParams.from;
        /*每次进入结算页面时清空当前优惠券信息*/
        $scope.$parent.currCoupons = {};
        /*当选择团餐时,保存当前合作企业信息*/
        $scope.$parent.TakeType3 = {};
        /*将时间数组转换为对象属性方便后续使用*/
        $scope.distributionTime = {};
        $scope.$parent.timeList.forEach(function (time) {
            $scope.distributionTime[time.value] = time;
        });

        /*生成订单包含的商品List*/
        $scope.$parent.order.orderInfoVoList = [];
        $scope.$parent.shoppingCart.forEach(function (item) {
            if (item.checked) {
                var obj = {};
                obj.commodityId = item.commodityId;
                obj.commodityNum = item.count;
                $scope.$parent.order.orderInfoVoList.push(obj);
            }
        });

        /*计算实付款*/
        $scope.calcOrderPrice = function(){
            ///*拿到餐品总额*/
            //$scope.discountPrice = $scope.$parent.shoppingCartTotalPrice;
            ///*判断是否为企业团餐,是:减去团餐折扣*/
            //if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId && $scope.$parent.order.takeType == 3) {
            //    $scope.discountPrice = $scope.discountPrice * $scope.$parent.TakeType3.discount;
            //}
            ///*判断是否使用了优惠券,是:减去优惠券金额*/
            //if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId) {
            //    $scope.discountPrice = $scope.discountPrice - $scope.$parent.currCoupons.price;
            //}
            ///*如果是门店配送加上配送费*/
            //if ($scope.$parent.order.takeType == 2) {
            //    if ($scope.discountPrice < 0) {
            //        $scope.discountPrice = 0;
            //    }
            //    $scope.discountPrice += $scope.$parent.currStore.distributePrice;
            //}
            ///*如果当前金额大于0,格式化*/
            //if ($scope.discountPrice >= 0) {
            //    $scope.$parent.order.price = $filter("number")($scope.discountPrice, 2);
            //}
            //else {
            //    $scope.$parent.order.price = 0.00;
            //}

            /*拿到餐品总额*/
            $scope.discountPrice = $scope.$parent.shoppingCartTotalPrice;
            /*判断是否为企业团餐,是:减去团餐折扣*/
            if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId && $scope.$parent.order.takeType == 3) {
                $scope.discountPrice = $scope.discountPrice * $scope.$parent.TakeType3.discount;
            }
            /*判断是否使用了优惠券,是:减去优惠券金额*/
            if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId) {
                $scope.discountPrice = $scope.discountPrice - $scope.$parent.currCoupons.price;
            }
            /*如果是门店配送加上配送费*/
            if ($scope.$parent.order.takeType == 2) {
                if ($scope.discountPrice < 0) {
                    $scope.discountPrice = 0;
                }
                $scope.discountPrice += $scope.$parent.currStore.distributePrice;
            }

            /*拷贝订单副本用于提交*/
            var submitOrder = angular.copy($scope.$parent.order);
            /*如果取餐方式为配送,检查是否满足配送条件(满XX元才能配送、收货地址)*/
            if (submitOrder.takeType == 2) {
                if ($scope.$parent.currUserAddress && $scope.$parent.currUserAddress.addressId) {
                    submitOrder.addressId = $scope.$parent.currUserAddress.addressId;
                    if (submitOrder.price < $scope.$parent.currStore.distributeCost) {
                        $scope.discountList = [];
                        $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                        return;
                    }
                }
                else {
                    $scope.discountList = [];
                    $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                    return;
                }
            }
            else if (submitOrder.takeType == 3) {/*如果取餐方式为团餐,检查是否满足团餐条件(参团地址)*/
                if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId) {
                    submitOrder.businessAddressId = $scope.$parent.currBusiness.addressId;
                    submitOrder.businessCode = $scope.$parent.currBusiness.businessCode;
                    submitOrder.mealInfoId = $scope.mealInfoId
                }
                else {
                    $scope.discountList = [];
                    $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                    return;
                }
            }
            /*是否使用了优惠券*/
            if ($scope.$parent.currCoupons) {
                submitOrder.couponsId = $scope.$parent.currCoupons.couponsId;
            }
            /*判断是否存在手机号*/
            if(!submitOrder.cellPhone || !/^1[\d]{10}$/.test(submitOrder.cellPhone)){
                $scope.discountList = [];
                $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                return;
            }
            /*设置订单门店ID*/
            submitOrder.storeId = $scope.$parent.currStore.storeId;

            $http.post("/order/calculateOrder",submitOrder).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.discountList = data.data.list;
                    $scope.$parent.order.price = data.data.total;
                }
                else{
                    $scope.discountList = [];
                    $scope.$parent.order.price = $scope.discountPrice >= 0 ? $scope.discountPrice : 0;
                }
            });
        };
        /*切换取餐方式时执行的函数*/
        $scope.changeTakeType = function () {
            var dateList, timeList;
            /*根据当前餐品餐别设置取餐时间*/
            $scope.$parent.mealInfoList.forEach(function (mealInfo) {
                if (mealInfo.itemList.length > 0 && mealInfo.itemList.some(function (item) {
                        return (item.checked)
                    })) {
                    timeList = angular.copy(mealInfo.mealTimeItemList);
                    /*设置订单餐别*/
                    $scope.$parent.order.mealInfoId = mealInfo.id;
                    /*拷贝餐别副本,用于后续界面团餐截至时间*/
                    $scope.mealInfoId = mealInfo.id;
                }
            });
            /*当前餐别为自提、配送时,设置取餐日期,格式化输出时间选择控件数据源.餐别为团餐时,清空当前合作企业信息并将时间选择控件数据源清空(该数据源的日期和时间由合作企业对象提供)*/
            if ($scope.$parent.order.takeType != 3) {
                dateList = angular.copy($scope.$parent.dateList);
                timeList.forEach(function (item) {
                    item.valueName = item.value;
                    item.value = item.key;
                });
                $scope.$parent.lttimedate = ltTimeSet.getTimeFn(dateList, timeList);
                /*如果该门店存在默认地址*/
                if($scope.$parent.currStore.defaultAddress && !$scope.$parent.currUserAddress){
                    $scope.$parent.currUserAddress = $scope.$parent.currStore.defaultAddress;
                }
            }
            else {
                $scope.$parent.currBusiness = null;
                $scope.$parent.lttimedate = [];
            }
            /*设置页面日期和时间的默认值*/
            if ($scope.$parent.lttimedate.length > 0) {
                $scope.$parent.exchangeDate = $scope.$parent.lttimedate[0].valueName;
                $scope.$parent.order.distributionDate = $scope.$parent.lttimedate[0].value;
                $scope.$parent.exchangeTime = $scope.$parent.lttimedate[0].list[0].valueName;
                $scope.$parent.order.distributionTime = $scope.$parent.lttimedate[0].list[0].value;
            }
            else {
                $scope.$parent.exchangeDate = "";
                $scope.$parent.order.distributionDate = "";
                $scope.$parent.exchangeTime = "";
                $scope.$parent.order.distributionTime = "";
            }
            /*计算当前实付款*/
            $scope.calcOrderPrice();
        };
        /*每次进入结算页,重新执行该函数*/
        $scope.changeTakeType();

        /*订单提交函数*/
        $scope.submitOrder = function () {
            /*餐品费用(非实付款)小于0或正在支付中,返回*/
            if ($scope.$parent.shoppingCartTotalPrice < 0 || $scope.paying) {
                return;
            }
            /*拷贝订单副本用于提交*/
            var submitOrder = angular.copy($scope.$parent.order);
            /*如果取餐方式为配送,检查是否满足配送条件(满XX元才能配送、收货地址)*/
            if (submitOrder.takeType == 2) {
                if ($scope.$parent.currUserAddress && $scope.$parent.currUserAddress.addressId) {
                    submitOrder.addressId = $scope.$parent.currUserAddress.addressId;
                    if (submitOrder.price < $scope.$parent.currStore.distributeCost) {
                        $scope.showComnPopup({
                            message: "当前门店满" + $scope.$parent.currStore.distributeCost + "元配送!",
                            type: "toast"
                        });
                        return;
                    }
                }
                else {
                    $scope.showComnPopup({message: "请选择收货地址!", type: "toast"});
                    return;
                }
            }
            else if (submitOrder.takeType == 3) {/*如果取餐方式为团餐,检查是否满足团餐条件(参团地址)*/
                if ($scope.$parent.currBusiness && $scope.$parent.currBusiness.addressId) {
                    submitOrder.businessAddressId = $scope.$parent.currBusiness.addressId;
                    submitOrder.businessCode = $scope.$parent.currBusiness.businessCode;
                    submitOrder.mealInfoId = $scope.mealInfoId
                }
                else {
                    $scope.showComnPopup({message: "请选择参团地址!", type: "toast"});
                    return;
                }
            }
            /*是否使用了优惠券*/
            if ($scope.$parent.currCoupons) {
                submitOrder.couponsId = $scope.$parent.currCoupons.couponsId;
            }
            /*判断是否存在手机号*/
            if(!submitOrder.cellPhone || !/^1[\d]{10}$/.test(submitOrder.cellPhone)){
                $scope.showComnPopup({message: "请输入正确的手机号码!", type: "toast"});
                return;
            }
            /*设置订单门店ID*/
            submitOrder.storeId = $scope.$parent.currStore.storeId;
            /*设置支付中Flag*/
            $scope.showComnPopup({message: "支付中...", type: "toast"});
            $scope.paying = true;
            /*发起订单提交请求*/
            $http.post("/order/submitOrder", submitOrder).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {/*正常订单走微信支付*/
                    var config = angular.fromJson(data.data.payConfig);
                    config.success = function (res) {
                        var parms = {type: "prePay_Id", data: data.data.prePay_Id};
                        $scope.getOrderInfo(parms);
                    };
                    config.fail = function (res) {
                        $timeout(function () {
                            $scope.showComnPopup({message: "网络繁忙,请重试!", type: "alert"});
                            $scope.paying = false;
                            $http.post("/index/requestError", {errorUrl: location.origin + "/order/submitOrder",errorRequest: angular.toJson(submitOrder),errorResponse:data.data.payConfig || angular.toJson(config),errorMessage:angular.toJson(res)});
                        }, 0);
                    };
                    config.cancel = function (res) {
                        /*发请求取消订单*/
                        $timeout(function () {
                            $scope.paying = false;
                            var parms = {};
                            if (data.data.orderId && data.data.orderId.length > 0) {
                                parms.orderId = data.data.orderId;
                            }
                            if (data.data.prePay_Id && data.data.prePay_Id.length > 0) {
                                parms.prePay_Id = data.data.prePay_Id;
                            }
                            $http.post("/order/cancel", parms);
                        }, 0);
                    };
                    wx.chooseWXPay(config);
                }
                else if (data.statusCode == 1) {/*0元支付订单*/
                    var parms = {type: "orderCode", data: data.data.orderCode};
                    $scope.getOrderInfo(parms);
                }
                else {
                    $scope.showComnPopup({message: data.statusMessage, type: "alert"});
                    $scope.paying = false;
                }
            }).error(function (data, status, headers, config) {
                if (status == 0) {
                    payError++;
                    if (payError <= 3) {
                        $scope.submitOrder();
                    }
                    else {
                        $scope.showComnPopup({
                            message: "当前网络异常,请重试!", type: "alert", alert: function () {
                                $scope.paying = false;
                                payError = 0;
                            }
                        });
                    }
                }
                else {
                    $scope.showComnPopup({
                        message: "errorStatus:" + status + " errorData:" + angular.toJson(data),
                        type: "alert"
                    });
                    $scope.paying = false;
                }
            });
        };
        /*通过prePay_Id或orderCode获取订单对象*/
        $scope.getOrderInfo = function (parms) {
            var sUrl = "/order/getUUID?" + parms.type + "=" + parms.data;
            /*获取订单信息,清空选择的优惠券、合作企业、用户地址信息,跳转至订单详情页*/
            $http.get(sUrl).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    $scope.paying = false;
                    $scope.$parent.currCoupons = {};
                    $scope.$parent.currBusiness = {};
                    $scope.$parent.currAddress = {};
                    $scope.go("order-detail", {
                        orderInfo: data.data,
                        orderId: data.data.orderId,
                        from: "pay"
                    });
                }
            }).error(function (data, status, headers, config) {
                $scope.getOrderInfo(parms);
            });
        };
        /*选择取餐日期和时间*/
        $scope.timePickerShowFn = function () {
            if ($scope.$parent.order.takeType == 3 && !$scope.$parent.currBusiness) {
                $scope.showComnPopup({message: "请选择参团地址!", type: "toast"});
                return;
            }
            $timeout(function () {
                var config = {
                    dataSource: $scope.$parent.lttimedate,
                    activeIndexList: [$scope.$parent.order.distributionDate, $scope.$parent.order.distributionTime]
                };
                config.success = function (res) {/*确定按钮回调函数,设置选中的日期和时间*/
                    $scope.$parent.exchangeDate = res[0].valueName;
                    $scope.$parent.order.distributionDate = res[0].value;
                    $scope.$parent.exchangeTime = res[1].valueName;
                    $scope.$parent.order.distributionTime = res[1].value;
                    /*如果当前餐品餐别为全时段,团餐截止时间将会根据选择的时间实时更新*/
                    if ($scope.$parent.order.mealInfoId == 1) {
                        for (var key in $scope.$parent.TakeType3.distributionTime) {
                            if ($scope.$parent.TakeType3.distributionTime[key] == $scope.$parent.order.distributionTime) {
                                $scope.mealInfoId = key;
                            }
                        }
                    }
                };
                $scope.showMutilScrollPopup(config);
            }, 50)
        };
        /*输入企业团餐modal框*/
        $scope.showBusinessPopup = function () {
            $scope.tmpCode = {};
            $scope.businessPopup = $ionicPopup.show({
                template: "<input placeholder='请输入合作企业代码' type='tel' ng-model='tmpCode.businessCode'autofocus><i class='btn-close' ng-click='businessPopup.close()'></i>",
                scope: $scope,
                cssClass: "businessPopup",
                buttons: [
                    {
                        text: "<b>确定</b>",
                        onTap: function (e) {
                            return $scope.tmpCode.businessCode;
                        }
                    }
                ]
            });
            $scope.businessPopup.then(function (res) {
                if (!res) {

                }
                else if (!angular.isNumber(Number(res))) {
                    $scope.showComnPopup({message: "请输入6位企业合作代码!", type: "toast"});
                }
                else {
                    $http.post("/order/checkBusinessCode", {
                        storeId: $scope.currStore.storeId,
                        businessCode: res
                    }).success(function (data, status, headers, config) {
                        if (data.statusCode == 0) {
                            /*当前合作企业地址List*/
                            if (data.data.enterpriseAddressList.length > 0) {
                                /*保存当前合作企业 时间选择数据源*/
                                $scope.$parent.TakeType3.distributionTime = data.data.distributionTime;
                                /*保存合作企业的折扣*/
                                $scope.$parent.TakeType3.discount = data.data.discount / 100;
                                /*如果合作企业地址只有一个不显示地址选择界面*/
                                if (data.data.enterpriseAddressList.length == 1) {
                                    $scope.useBusinessAddressModal(data.data.enterpriseAddressList[0])
                                }
                                else {
                                    $scope.businessAddressList = data.data.enterpriseAddressList;
                                    $scope.businessAddressModal.show();
                                }
                            }
                        }
                        else {
                            $scope.showComnPopup({message: data.statusMessage, type: "alert"});
                        }
                    });
                }
            });
        };
        $ionicModal.fromTemplateUrl("businessAddress.html", {
            scope: $scope,
            animation: "slide-in-left"
        }).then(function (modal) {
            $scope.businessAddressModal = modal;
        });
        /*选择参团地址*/
        $scope.useBusinessAddressModal = function (item) {
            $scope.$parent.currBusiness = item;
            var dateList, timeList;

            dateList = angular.copy($scope.$parent.dateList);
            dateList.forEach(function (item) {
                item.valueName = item.chineseDate + "(" + item.sequence + ")";
                item.value = item.date;
            });
            /*如果当前餐别为全时段,早中晚时段都可选*/
            if ($scope.$parent.order.mealInfoId == 1) {
                timeList = [];
                if ($scope.$parent.TakeType3.distributionTime[2]) {
                    timeList.push($scope.distributionTime[$scope.$parent.TakeType3.distributionTime[2]]);
                }
                if ($scope.$parent.TakeType3.distributionTime[3]) {
                    timeList.push($scope.distributionTime[$scope.$parent.TakeType3.distributionTime[3]]);
                }
                if ($scope.$parent.TakeType3.distributionTime[4]) {
                    timeList.push($scope.distributionTime[$scope.$parent.TakeType3.distributionTime[4]]);
                }
            }
            else {
                /*判断当前参团地址是否支持配送*/
                if ($scope.$parent.TakeType3.distributionTime[$scope.$parent.order.mealInfoId]) {
                    timeList = [$scope.distributionTime[$scope.$parent.TakeType3.distributionTime[$scope.$parent.order.mealInfoId]]];
                }
                else {
                    $scope.showComnPopup({message: "当前餐别不支持配送!", type: "toast"});
                    return;
                }
            }
            /*生成当前参团地址对应的时间选择数据源*/
            $scope.$parent.lttimedate = ltTimeSet.getTimeFn(dateList, timeList);
            /*设置日期和时间默认值*/
            $scope.$parent.exchangeDate = $scope.$parent.lttimedate[0].valueName;
            $scope.$parent.order.distributionDate = $scope.$parent.lttimedate[0].value;
            $scope.$parent.exchangeTime = $scope.$parent.lttimedate[0].list[0].valueName;
            $scope.$parent.order.distributionTime = $scope.$parent.lttimedate[0].list[0].value;
            /*如果是全时段餐品,重置当前餐别ID*/
            if ($scope.$parent.order.mealInfoId == 1) {
                for (var key in $scope.$parent.TakeType3.distributionTime) {
                    if ($scope.$parent.TakeType3.distributionTime[key] == $scope.$parent.order.distributionTime) {
                        $scope.mealInfoId = key;
                    }
                }
            }
            /*计算实付款*/
            $scope.calcOrderPrice();
            /*关闭参团地址modal*/
            if ($scope.businessAddressModal.isShown()) {
                $scope.businessAddressModal.hide();
            }
        };
        /*关闭参团地址modal*/
        $scope.closeBusinessAddressModal = function () {
            $scope.businessAddressModal.hide();
        };
        /*暂时使用*/
        $ionicModal.fromTemplateUrl("coupons.html", {
            scope: $scope,
            animation: "slide-in-left"
        }).then(function (modal) {
            $scope.couponsModal = modal;
        });
        $scope.closeCouponsModal = function () {
            $scope.couponsModal.hide();
        };
        $scope.openCouponsModal = function () {
            $http.post("/coupons/getCouponsList", {test: 1}).success(function (data, status, headers, config) {
                if (data.statusCode == 0) {
                    var nowTick = new Date().getTime();
                    $scope.couponsList = data.data.filter(function (coupons) {
                        //if (coupons.stores) {
                        //    coupons.stores = "," + coupons.stores + ",";
                        //}
                        //if (coupons.commodities) {
                        //    coupons.commodities = "," + coupons.commodities + ",";
                        //}
                        ///*判断条件 (优惠券门店为空 || 优惠券门店列表中包含当前门店) && 优惠券有效期包含当前时间 && 优惠券状态为未使用 && （优惠券商品列表中包含当前购物车商品 || 优惠券商品列表为空)*/
                        //if (coupons.starttime <= nowTick && nowTick <= coupons.endtime && coupons.status == 1 && (!coupons.stores || (coupons.stores.indexOf("," + $scope.$parent.currStore.storeId + ",") >= 0))) {
                        //    return $scope.$parent.shoppingCart.filter(function (item) {
                        //        /*筛选出所有选中的商品(有可能购物车中存在其他互斥餐别的商品)*/
                        //        return (item.checked)
                        //    }).some(function (item) {
                        //        /*筛选出 商品列表中包含当前购物车商品 || 优惠券商品列表为空(未限制可使用商品) 的优惠券*/
                        //        return (!coupons.commodities || coupons.commodities.indexOf("," + item.commodityId + ",") >= 0)
                        //    })
                        //}
                        //else {
                        //    return false;
                        //}

                        /*所有未使用的优惠券都可以显示,点击使用具体某张优惠券时再判断是否满足其他条件*/
                        return (nowTick <= coupons.endtime && coupons.status == 1);
                    });
                    $scope.couponsList.forEach(function (item) {
                        item.displayTime = $filter("date")(item.starttime, "yyyy-MM-dd") + "~" + $filter("date")(item.endtime, "yyyy-MM-dd");
                        if ($scope.$parent.currCoupons && $scope.$parent.currCoupons.couponsId == item.couponsId) {
                            item.checked = true;
                        }
                    });
                    $scope.couponsModal.show();
                }
            });
        };
        /*使用选中的优惠券*/
        $scope.useCoupons = function (coupons) {
            var nowTick = new Date().getTime();
            /*这里检查优惠券能否被使用的条件*/
            if (coupons.stores && coupons.stores.indexOf(",") != 0) {
                coupons.stores = "," + coupons.stores + ",";
            }
            if (coupons.commodities && coupons.commodities.indexOf(",") != 0) {
                coupons.commodities = "," + coupons.commodities + ",";
            }

            var couponsErrMsg = "";
            /*检查优惠券的使用日期区间*/
            if(coupons.starttime > nowTick){
                couponsErrMsg = "当前优惠券未到使用期!";
            }
            if(couponsErrMsg.length == 0 && nowTick > coupons.endtime){
                couponsErrMsg = "当前优惠券已过期!";
            }
            if(couponsErrMsg.length == 0 && coupons.status != 1){
                couponsErrMsg = "当前优惠券状态异常!";
            }
            if(couponsErrMsg.length == 0 && coupons.stores && coupons.stores.indexOf("," + $scope.$parent.currStore.storeId + ",") < 0){
                couponsErrMsg = "当前优惠券可用门店不包含当前门店!";
            }
            if(couponsErrMsg.length == 0 && !$scope.$parent.shoppingCart.filter(function (item) {
                    /*筛选出所有选中的商品(有可能购物车中存在其他互斥餐别的商品)*/
                    return (item.checked)
                }).some(function (item) {
                    /*筛选出 商品列表中包含当前购物车商品 || 优惠券商品列表为空(未限制可使用商品) 的优惠券*/
                    return (!coupons.commodities || coupons.commodities.indexOf("," + item.commodityId + ",") >= 0)
                })){
                couponsErrMsg = "当前优惠券可用商品不支持当前所选商品!!";
            }
            if($scope.$parent.shoppingCartTotalPrice < coupons.costPrice){
                couponsErrMsg = "当前优惠券必须满"+ coupons.costPrice +"元才可使用!";
            }
            if(couponsErrMsg.length > 0){
                $scope.showComnPopup({message: couponsErrMsg, type: "toast"});
                return;
            }

            coupons.checked = true;
            $scope.$parent.currCoupons = coupons;
            $scope.calcOrderPrice();
            $scope.closeCouponsModal();
        };
        /*不使用优惠券*/
        $scope.noUseCoupons = function () {
            /*当前优惠券对象置空*/
            $scope.$parent.currCoupons = null;
            $scope.calcOrderPrice();
            $scope.closeCouponsModal();
        };
    });
}]);