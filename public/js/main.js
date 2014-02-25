'use strict';

var checkLoggedin = function($q, $timeout, $http, $location) {
    // Initialize a new promise
    var deferred = $q.defer();
    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
            $timeout(deferred.resolve, 0);
        }
        // Not Authenticated
        else {
            $timeout(function(){deferred.reject();}, 0);
            $location.url('/login');
        }
    });
};

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
            .when('/cars/:carId', {
                templateUrl: 'partials/viewCar',
                controller: 'ViewCarCtrl',
                resolve : {
                    car : function(CarLoaderId) {
                        return CarLoaderId();
                    }
                }
            })
            .when('/cars/edit/:carId', {
                templateUrl: 'partials/newCarForm',
                controller: 'EditCarCtrl',
                resolve : {
                    loggedin : checkLoggedin,
                    car : function(CarLoaderId) {
                        return CarLoaderId();
                    }
                }
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
            .when('/account', {
                templateUrl: 'partials/account',
                controller: 'AccountCtrl',
                resolve : {
                    loggedin : checkLoggedin,
                    user : function(UserLoader) {
                        return UserLoader();
                    },
                    cars : function(CarLoader) {
                        return CarLoader({ ownedCar : true });
                    }
                }
            })
            .when('/account/edit', {
                templateUrl: 'partials/editAccount',
                controller: 'EditAccountCtrl',
                resolve : {
                    loggedin : checkLoggedin,
                    user : function(UserLoader) {
                        return UserLoader();
                    }
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
// This code is unfortunatly tricky to test

    // // this code is executed on initialization of angular
    // .run(['$rootScope','$http',function($rootScope,$http) {
    //     $http.get('/loggedin').success(function(user) {
    //         // Authenticated
    //         if (user !== '0')
    //             $rootScope.logged = true;
    //         // Not Authenticated
    //         else
    //             $rootScope.logged = false;
    //     });
    // }]);
