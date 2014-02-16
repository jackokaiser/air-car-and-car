'use strict';

/* Directives */

angular.module('myApp.directives', [])
    .directive('pwCheck', function() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        };
    })
    .directive('daterange', function() {
        var validator = function(value) {
            var valid = value && value.dateFrom && value.dateTo;
            var ret = valid ? true : false;
            return ret;
        };

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
                            // set model validity
                            ngModel.$setValidity('daterange',
                                                 validator(ngModel.$modelValue));

                        });
                    });
            }
        };
    })

    .directive('alertBar', ['$parse', function($parse) {
        return {
            restrict: 'A',
            templateUrl: 'partials/alertBar.jade',
            link: function(scope, elem, attrs) {
                var alertMessageAttr = attrs['alertmessage'];
                scope.errorMessage = null;

                scope.$watch(alertMessageAttr, function(newVal) {
                    scope.errorMessage = newVal;
                });
                scope.hideAlert = function() {
                    scope.errorMessage = null;
                    // Also clear the error message on the bound variable
                    // Do this so that in case the same error happens again
                    // the alert bar will be shown again next time
                    $parse(alertMessageAttr).assign(scope, null);
                };
            }
        };
    }]);
