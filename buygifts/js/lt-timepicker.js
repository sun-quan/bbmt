/**
*  make:tinlee
*  <div timepicker  timepicker-data="timeset" repeat="2" callback="callBack"  cancel="cancel">
            <element>此处存放你要展示的内容</elment>
    </div>
* @timepicker-data  变量名,存放滚动所需数据,
                格式:  [{
                           name: "2011年",
                                value: "2011-",
                                list: [
                                    {
                                        name: "3月4号",
                                        value: "3-4"
                                    },{
                                        name: "3月4号",
                                        value: "3-4"
                                    }
                                ]},name: "2011年",
                                value: "2011-",
                                list: [
                                    {
                                        name: "3月4号",
                                        value: "3-4"
                                    },{
                                        name: "3月4号",
                                        value: "3-4"
                                    }
                                ]}]
                !禁止在同一数据内出现相同的数据
*@repeat 有几列
*@callback  即点击确认的函数
*@cancel 即点击取消的函数
*!callback 和 cancel 函数的形参都是滚动选择的value
*!压缩版已包含css
*/


angular.module('lt.timepicker', []).directive('timepicker', [function() {
                    // Runs during compile
                    return {
                        // name: '',
                        // priority: 1,
                        // terminal: true,
                        scope: {title:"=",callback:"=",data:"=timepickerData",repeat:"@",cancel:"=cancel"}, // {} = isolate, true = child, false/undefined = no change
                        controller: function($scope, $element, $attrs, $transclude) {
                            $scope.show = false;
                            $scope.timepicker=[];
                            $scope.setData=function (obj,data){
                                obj.data = data;
                                obj.num = i;
                                obj.minheight = 0;
                                obj.maxheight = data.length * 40 - 20;
                                obj.index = parseInt(data.length/2  + 0.5);
                                obj.deltaY = obj.index * 40 - 20;
                            }

                            $scope.select = {
                                start: 0
                            };
                            $scope.open = function() {
                                $scope.show = true;
                            }
                            $scope.hide = function() {
                                $scope.show = false;
                            }
                            
                            function setIndex(index) {
                                return parseInt(index / 40);
                            }
                            $scope.hmTab = function(obj) {
                                
                            }
                            $scope.hmPanStart = function(key) {
                                $scope.select.key = key;
                                $scope.select.element = $scope.timepicker[key];
                                $scope.select.start = 0;
                                $scope.select.oldIndex = $scope.select.element.index;
                            }
                            $scope.hmPanUp = function(obj, key) {
                                $scope.select.key = key;
                                $scope.select.element = $scope.timepicker[key];
                                var x = obj.deltaY - $scope.select.start;
                                $scope.select.start = obj.deltaY;
                                upD(x)
                            }
                            function upD(x) {
                                var element = $scope.select.element;
                                element.deltaY -= x;
                                element.index = Math.ceil((element.deltaY - element.minheight + 39) / 40) - 1;
                            }
                            $scope.panEnd = function() {
                                var element = $scope.select.element;
                                var max = element.data.length * 40 - 20;
                                var min =40;
                                if (element.deltaY >= max) {
                                    element.deltaY = max;
                                } else if (element.deltaY <= min) {
                                    element.deltaY = min;
                                }
                                
                                element.index = Math.ceil((element.deltaY) / 40);
                                element.deltaY = element.index * 40 - 20;
                                if(element.index!=$scope.select.oldIndex){
                                    $scope.dataReset(element.num);
                                }
                                
                            }
                            $scope.dataReset=function(num){
            
                                for(var i=num+1;i<$scope.repeat;i++){
                                    $scope.setData( $scope.timepicker[i],$scope.timepicker[i-1].data[$scope.timepicker[i-1].index-1].list);
                                }

                                
                            }
                            $scope.eventstop = function($event) {
                                $event.stopPropagation();
                            }
                            $scope.returnResult = function(type) {
                                    var re = [];
                                    for (var i=0; i< $scope.timepicker.length;i++) {
                                        re.push($scope.timepicker[i].data[$scope.timepicker[i].index-1].value);
                                    }
                                    if(type=="cannel"){
                                         $scope.cancel(re);
                                    }else{
                                         $scope.callback(re);
                                    }
                                    $scope.show = false;
                                };

                            for(var i=0;i<$scope.repeat;i++){
                                $scope.timepicker[i]={};
                                if(i>0){
                                    var data=$scope.timepicker[i-1].data[$scope.timepicker[i-1].index-1].list;
                                }else{
                                    var data=$scope.data;
                                }
                                $scope.setData($scope.timepicker[i],data);
                             
                            };
                              
                        },
                        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
                        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
                        template: '<div ng-click="open()" ng-transclude></div>'+
                                '<div Class="lt-timepicker" ng-click="hide()" ng-if="show">' +
                                '<div Class="outside" ng-click="eventstop($event)">' + 
                                '<div Class="title">' +
                                 '<div class="title-btn"  ng-click="hide();returnResult(\'cancel\')">取消</div>' + 
                                 '<div class="title-btn">选择时间</div>' +
                                  '<div class="title-btn" ng-click="returnResult()">确定</div>' +
                                   '</div>' + 
                                   '<div class="flex-out">' + 
                                   '<div class="flex"  hm-panStart="hmPanStart(key)" hm-panend="panEnd" hm-pan="hmPanUp($event,key)"  ng-repeat="(key,value) in timepicker">{{timepicker.$index}}' + 
                                   '<div class="zhezhao"></div>' + 
                                   '<div class="time-choose" >' + 
                                   '<div class="time-item" style="-webkit-transform:translateY({{-value.deltaY}}px);">' + 
                                   '<div ng-class="{\'active\':((value.deltaY)/40|ceil:value.maxheight)==$index}" ng-repeat="(key2,value2) in value.data" ng-bind="value2.name">' +
                                    '</div>' + 
                                    '</div>' + 
                                   '</div>' + 
                                   '</div>' + 
                                   '</div>' + 
                                   '</div>' + 
                           '</div>',
                        // templateUrl: '',
                        // replace: true,
                        transclude: true,
                        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                        link: function($scope, iElm, iAttrs, controller) {
                            console.log($scope.cancel)
                        }
                    };
                }]).filter("ceil", function() {
                    return function(input, max) {
                        return Math.ceil(input-1);
                    }
                })