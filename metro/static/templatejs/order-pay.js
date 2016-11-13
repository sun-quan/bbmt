(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/order-pay.html',
    '<ion-view class="pay">\n' +
    '    <ion-header-bar align-title="center" class="bar-energized">\n' +
    '<!--         <a class="btn-back" ng-click="go(-1)"></a>\n' +
    ' -->        <h1 class="title">订单支付</h1>\n' +
    '    </ion-header-bar>\n' +
    '    <ion-content overflow-scroll="false">\n' +
    '        <div >\n' +
    '            <div class="item item-divider">\n' +
    '                预定餐品\n' +
    '                <span class="pull-right">共{{order.commodityNumber}}件</span>\n' +
    '            </div>\n' +
    '            <ul class="list">\n' +
    '                <li class="xs-item1" ng-repeat="item in order.commodityList">\n' +
    '                    <img ng-src="{{global.adminUrl+item.commodityImg}}"/>\n' +
    '                    <div class="desc">\n' +
    '                        <p ng-bind="item.commodityName"></p>\n' +
    '                        <div class="bottom">\n' +
    '                            <span class="txt-price" ng-bind="item.promotion|currency :\'￥\'"></span>\n' +
    '                            <div class="number">\n' +
    '                                <span class="count" ng-bind="\'× \'+item.totalNum"></span>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </li>\n' +
    '            </ul>\n' +
    '          \n' +
    '            \n' +
    '            <div class="item item-divider title">\n' +
    '                餐品费用\n' +
    '                <span class="pull-right" ng-bind="order.total|currency :\'￥\'"></span>\n' +
    '            </div>\n' +
    '           \n' +
    '            \n' +
    '            <div></div>\n' +
    '            <div class="item item-divider title">\n' +
    '                支付方式\n' +
    '            </div>\n' +
    '            <div class="payType">\n' +
    '                <i class="payIcon"></i>\n' +
    '                <span class="supportType">微信支付</span>\n' +
    '                <span class="tip">暂时只支持微信支付</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '     \n' +
    '    </ion-content>\n' +
    '    <div ng-if="paying" class="payLoadingBG">\n' +
    '        <div class="outside">\n' +
    '            <div class="confirm-content fade in">\n' +
    '                <div>\n' +
    '                    <span>支付中...</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="bar bar-footer bar-dark" >\n' +
    '        <div class="row-basket">\n' +
    '            <button  class="pull-right" ng-click="submitOrder()" ng-disabled="paying">\n' +
    '                <a class="btn-o-tobuy font16">确认支付</a>\n' +
    '            </button>\n' +
    '          \n' +
    '            <div class="media media-basket">\n' +
    '                <div class="media-left">\n' +
    '                    <div class="type2">\n' +
    '                        <span>实付款:</span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="media-body">\n' +
    '                    <div class="media-heading" ng-bind="\'￥\'+ order.total"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '  \n' +
    '</ion-view>\n' +
    '');
}]);
})();
