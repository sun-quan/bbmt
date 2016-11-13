(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/pay-success.html',
    '<ion-view class="pay">\n' +
    '    <ion-header-bar align-title="center" class="bar-energized">\n' +
    '<!--         <a class="btn-back" ng-click="go(-1)"></a>\n' +
    ' -->        <h1 class="title">预定成功</h1>\n' +
    '    </ion-header-bar>\n' +
    '<div class="pay-success">\n' +
    '	<img src="metro/static/img/pay-success.png" style="width:100%" />\n' +
    '	  <div class="order-number" >\n' +
    '                <div class="title">取餐号:</div>\n' +
    '                <div class="orderNumber">\n' +
    '                    <span>{{orderNumber}}</span>\n' +
    '                </div>\n' +
    '                <div class="tips">到店后出示上方号码，提取您的餐品</div>\n' +
    '            </div>\n' +
    '	<a href="index.html" class="xs-btn">去首页逛逛</a>\n' +
    '</div>\n' +
    '	</ion-view>');
}]);
})();
