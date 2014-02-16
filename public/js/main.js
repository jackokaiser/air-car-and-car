'use strict';

var checkLoggedin = function($q, $timeout, $http, $location, ErrorService){
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve, 0);
        // Not Authenticated
        else {
            // ErrorService.setError('You need to log in');
            $timeout(function() {
                deferred.reject(); }, 0); $location.url('/login');
        }
    });
};

// Declare app level module which depends on filters, and services

angular.module('myApp', [
    // 'ngCookies',
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
                controller: 'NewCarCtrl',
                resolve : {
                    loggedin : checkLoggedin
                }
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl'
            })
            .otherwise({
                redirectTo: '/cars'
            });

        $locationProvider.html5Mode(true);
    });
