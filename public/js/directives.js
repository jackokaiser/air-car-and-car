'use strict';

/* Directives */

angular.module('myApp.directives', [])
    .directive('datepicker', function() {
        return {
            // enforce angular js default of restricting the directive
            // to attributes only
            restrict: 'A',
            // always use along an ng-model
            require: '?ngModel',
            scope: {
                // this method needs to be defined and
                // passed in to the directive from the view controller

                // bind the select function we refer to the right scope
                select: '&'
            },
            link : function( scope,element, attrs, ngModel) {
                if (!ngModel) return;

                var optionsObj = {
                    format : 'dd/mm/yy',
                    startDate : 'd'
                };
                var updateModel = function (dateTxt) {
                    scope.$apply(function () {
                        // call the internal angular js
                        // helper to update the two way binding
                        ngModel.$setViewValue(dateTxt);
                    });
                };
                ngModel.$render = function () {
                    // use the angular js internal
                    // 'binding specific' variable
                    element.datepicker('setDate',
                                       ngModel.$viewValue || '');
                };
                element.datepicker(optionsObj)
                    .on('changeDate',function(e) {
                        updateModel(e.date);
                        if(scope.select) {
                            scope.$apply(function() {
                                scope.select({date:e.date});
                            });
                        }
                    });
            }
        };
    })
    .directive('daterange', function() {
        return {
            // enforce angular js default of restricting the directive
            // to attributes only
            restrict: 'A',
            // always use along an ng-model
            require: 'ngModel',
            replace : true,
            templateUrl : 'partials/daterange.jade',
            link : function( scope,element, attrs, ngModel) {
                if (!ngModel) return;

                var optionsObj = {
                    format : 'dd/mm/yy',
                    startDate : 'd'
                };
                element.datepicker(optionsObj)
                    .on('changeDate',function(e) {
                        // view triggered change date
                        // let's update the model
                        var oldValue = ngModel.$modelValue || {};
                        scope.$apply(function() {
                            // update the datefrom value
                            if(e.target.name==='dateFrom') {
                                oldValue.dateFrom = e.date;
                                ngModel.$setViewValue(oldValue);
                            }
                            // update the dateto value
                            else if(e.target.name==='dateTo') {
                                oldValue.dateTo = e.date;
                                ngModel.$setViewValue(oldValue);
                            }
                        });
                    });
            }
        };
    })
    .directive('appVersion', function (version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    });
