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
    .directive('appVersion', function (version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    });
