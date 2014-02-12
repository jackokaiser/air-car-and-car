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
    .controller('NavCtrl', function ($scope,$location) {
        $scope.brand = 'AirCnC';
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

    })
    .controller('SignupCtrl', function ($scope,$http,$location) {
    })
    .controller('LoginCtrl', function ($scope,$http,$location) {
        $scope.message='';
        $scope.createUser = function() {
            var optionsObj = {
                method : 'POST',
                url : '/api/user',
                data : $scope.user
            };
            $http(optionsObj)
                .success(function (data, status, headers, config) {
                    console.log('User ' + config.data.name +
                                ' has been registered!');
                    $location.url('/user/name');
                }).error(function (data, status, headers, config) {
                    $scope.message = 'An error has occured while '+
                        'registering user ' + config.data.name;
                });
        };
        $scope.loginUser = function() {
        };
    })
    .controller('RootCtrl', function ($scope, $http) {

    })
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
            // drop previous cars
            cars = null;
            // forge query
            var query = {
                dateFrom : new Date($scope.dateQueryFrom).getTime(),
                dateTo : new Date($scope.dateQueryTo).getTime(),
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
                throw new Error('Cannot get cars!');
                cars = null;
                $scope.cars = cars;
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
