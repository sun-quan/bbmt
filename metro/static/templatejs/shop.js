(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/shop.html',
    '<ion-view class="itemList">\n' +
    '    <ion-header-bar align-title="center" class="bar-energized">\n' +
    '        <div class="title">\n' +
    '            <span class="container icon">\n' +
    '                <span ng-bind="$parent.currStore.name" class="storeName ng-binding"></span>\n' +
    '            </span>\n' +
    '        </div>\n' +
    '    </ion-header-bar>\n' +
    '    <ion-content delegate-handle="mainScroll" scroll-event-interval="800" on-scroll="swipe()" overflow-scroll="false">\n' +
    '        <div class="mainContent">\n' +
    '            <div class="list-content">\n' +
    '                <ul class="list">\n' +
    '                    <li class="xs-item1" ng-class="{\'item-divider\':item.name}" ng-repeat="item in totalItemList track by $index" ng-style="{true:{\'height\':\'{{item.height+\'px\'}}\'}}[item.empty]">\n' +
    '                        <span ng-if="item.name">{{::item.name}}</span>\n' +
    '                        <!--<img ng-if="!item.name && !item.empty" ng-src="{{::(imgRoot + item.scan)}}" ui-sref="commodity-detail({commodityId:item.commodityId})" />-->\n' +
    '                        <img ng-if="!item.name && !item.empty" ng-src="{{::(imgRoot + item.scan)}}" />\n' +
    '                        <div class="desc" ng-if="!item.name && !item.empty">\n' +
    '                            <p class="title">{{::item.commodityName}}</p>\n' +
    '                            <div>\n' +
    '                                <i class="icon-am" ng-if="item.mealId == 2 || item.mealId == 1"></i>\n' +
    '                                <i class="icon-mm" ng-if="item.mealId == 3 || item.mealId == 1"></i>\n' +
    '                                <i class="icon-pm" ng-if="item.mealId == 4 || item.mealId == 1"></i>\n' +
    '                            </div>\n' +
    '                            <div class="bottom">\n' +
    '                                <span class="txt-price">￥{{::item.promotion}}</span>\n' +
    '                                <div class="number">\n' +
    '                                <span class="minusCount">\n' +
    '                                    <div ng-show="item.count > 0" style="display: table">\n' +
    '                                        <span class="minus" ng-click="removeItem(item)"></span>\n' +
    '                                        <span class="count" ng-bind="item.count"></span>\n' +
    '                                    </div>\n' +
    '                                </span>\n' +
    '                                    <span class="plus" ng-click="addItem(item)"></span>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </li>\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </ion-content>\n' +
    '    <div class="bar bar-footer bar-dark">\n' +
    '        <div class="row-basket">\n' +
    '            <div class="pull-right" ng-click="go(\'shoppingCart\')" style="pointer-events: auto;">\n' +
    '                <a class="btn-o-tobuy {{shoppingCartTotalPrice <= 0 ? \'btn-o-tobuy-none\' : \'font16\'}}" ng-bind="shoppingCartTotalPrice > 0 ? \'去结算\':\'选择任意餐品\'"></a>\n' +
    '            </div>\n' +
    '            <div class="media media-basket">\n' +
    '                <div class="media-left">\n' +
    '                    <img class="media-object" src="img/home/basket.png" ng-click="basketShow = basketShow ? !basketShow:true">\n' +
    '                    <div class="xs-badge">\n' +
    '                        <span class="badge" ng-bind="shoppingCartTotalNum"></span>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div class="media-body">\n' +
    '                    <div class="media-heading" ng-bind="\'￥\' + (shoppingCartTotalPrice|number:2)"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</ion-view>');
}]);
})();
