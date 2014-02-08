'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/cars', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/map', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    when('/newcar', {
      templateUrl: 'partials/partial3',
      controller: 'MyCtrl3'
    }).
    otherwise({
      redirectTo: '/cars'
    });

  $locationProvider.html5Mode(true);
});
