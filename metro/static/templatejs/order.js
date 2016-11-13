(function(module) {
try {
  module = angular.module('template');
} catch (e) {
  module = angular.module('template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/order.html',
    '');
}]);
})();
