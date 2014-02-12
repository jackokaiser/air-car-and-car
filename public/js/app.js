'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    'myApp.controllers',
    'myApp.filters',
    'myApp.services',
    'myApp.directives'
])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/cars', {
                templateUrl: 'partials/cars',
                controller: 'CarCtrl'
            })
            .when('/map', {
                templateUrl: 'partials/maps',
                controller: 'MapCtrl'
            })
            .when('/newcar', {
                templateUrl: 'partials/newCarForm',
                controller: 'NewCarCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/cars'
            });

        $locationProvider.html5Mode(true);
    });
