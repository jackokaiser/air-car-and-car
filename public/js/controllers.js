'use strict';

// Models

// the car array
var cars;
// the car instance for registration
var car;

/* Controllers */
Array.prototype.findIndex = Array.prototype.findIndex ||
    function (callback) {
        for (var i=0;i<this.length;i++)
        {
            if(callback(this[i],i))
                return i;
        }
    };

angular.module('myApp.controllers', [])
    .controller('NavCtrl', ['$scope','$location','$rootScope',function ($scope,$location,$rootScope) {
        $scope.brand = 'AirCnC';
        $scope.isLogged = $rootScope.logged;
        $scope.links = [
            {name: 'cars', url: '/cars'},
            // coming soon
            // {name: 'map', url: '/map'},
            {name: 'newcar', url: '/newcar'}
        ];
        var updateUrl = function() {
            // get current url
            $scope.url = $location.path();
        };
        // watch path
        // care: isn't property of the scope
        $scope.$watch(function(){
            return $location.path();
        }, updateUrl);

    }])
    .controller('SignupCtrl', ['$scope','$http','$location','$rootScope', function ($scope,$http,$location,$rootScope) {
        $scope.signupUser = function() {

            var optionsObj = {
                method : 'POST',
                url : '/signup',
                data : $scope.user
            };
            $http(optionsObj)
                .success(function (data, status, headers, config) {
                    $location.path('/cars');
                    $rootScope.logged=true;
                }).error(function (data, status, headers, config) {
                    console.log("Error occured while sign up");
                    $rootScope.logged=false;
                });

        };
    }])
    .controller('LoginCtrl', ['$scope','$http','$location','$rootScope',function ($scope,$http,$location,$rootScope) {
        $scope.loginUser = function() {
            var optionsObj = {
                method : 'POST',
                url : '/login',
                data : $scope.user
            };
            $http(optionsObj)
                .success(function (data, status, headers, config) {
                    $location.path('/cars');
                    $rootScope.logged=true;
                }).error(function (data, status, headers, config) {
                    console.log("Error occured while login");
                    $rootScope.logged=false;
                });
        };
    }])
    .controller('RootCtrl', ['$scope', '$location', 'ErrorService', function ($scope, $location, ErrorService) {
        $scope.errorService = ErrorService;
        $scope.$on('event:loginRequired', function() {
            $location.path('/login');
        });
    }])
    .controller('CarCtrl', function ($scope, $http) {
        // debugging : get database
        $scope.cars = cars;
        $http({
            method: 'GET',
            url: '/api/cars'
        }).success(function (data, status, headers, config) {
            data.cars.forEach(function(c) {
                c.dateFrom = Date.parse(c.dateFrom);
                c.dateTo = Date.parse(c.dateTo);
            });
            $scope.carsDB = data.cars;

        }).error(function (data, status, headers, config) {
            throw new Error('Cannot get cars DB!');
        });

        $scope.message = '';
        $scope.carQuery = function ()
        {
            console.debug($scope.dateRange);
            // drop previous cars
            cars = null;
            // forge query
            var query = {
                dateFrom : new Date($scope.dateRange.dateFrom).getTime(),
                dateTo : new Date($scope.dateRange.dateFrom).getTime(),
                location : $scope.locationQuery
            };
            console.log(query);
            // get request to server
            $http({
                method: 'GET',
                url: '/api/cars',
                params: query
            }).success(function (data, status, headers, config) {
                console.log("Success! received %d cars from server", data.cars.length);
                if (data.cars.length > 0) {
                    cars = data.cars;
                    $scope.message = '';
                }
                else {
                    $scope.message = 'Sorry, no car available for that query';
                }
                $scope.cars = cars;
            }).error(function (data, status, headers, config) {
                cars = null;
                $scope.cars = null;
                throw new Error('Cannot get cars!');
            });
        };
    })
    .controller('MapCtrl', function ($scope) {
        // write Ctrl here
    })
    .controller('NewCarCtrl', function ($scope,$http) {
        // write Ctrl here
        $scope.message='';
        $scope.car = car;
        $scope.addCar = function()
        {
            // in case user added non digit
            $scope.car.price = parseInt($scope.car.price,10);
            $scope.car.dateFrom = $scope.dateRange.dateFrom;
            $scope.car.dateTo = $scope.dateRange.dateTo;
            car = $scope.car;
            // push to server
            var optionsObj = {
                method : 'POST',
                url : '/api/cars',
                data : $scope.car
            };
            $http(optionsObj)
                .success(function (data, status, headers, config) {
                    $scope.message = 'Thanks, the car ' + config.data.name +
                        ' has been registered!';
                }).error(function (data, status, headers, config) {
                    $scope.message = 'An error has occured while '+
                        'registering the car ' + config.data.name;
                });
            // $location.url('/');
        };

    });
