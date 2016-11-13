 angular.module("xs1h", ["ionic", "template"]).config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {
     $urlRouterProvider.when('', '/shop');
     $stateProvider.state('shop', {
             url: "/shop/:storeId/:orderNumber",
             views: {
                 mainContent: {
                     templateUrl: "template/shop.html",
                     controller: "shopCtrl"
                 }
             }
         }).state('orderpay',{
             url: "/orderpay?storeId&orderNumber",
             views:{
             	mainContent:{
             		templateUrl: "template/order-pay.html",
            		controller: "orderPayCtrl"
             	}
             }
           
         }).state('paysuccess', {
             url: "/paysuccess?orderNumber",
             views:{
             	mainContent:{
             		templateUrl: "template/pay-success.html",
            		controller: "paySuccessCtrl"
             	}
             }
           
         }).state('order', {
             url: "/order",
             templateUrl: "template/order.html",
             controller: "orderCtrl"
         })
         //$locationProvider.html5Mode(true);
         //$ionicConfigProvider.views.swipeBackEnabled(false);
         //$ionicConfigProvider.scrolling.jsScrolling(false);
       $httpProvider.interceptors.push('timestampMarker');

 }]);