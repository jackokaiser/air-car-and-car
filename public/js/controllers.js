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
    .controller('NavCtrl', ['$scope','$location','$http', 'ErrorService', '$rootScope',function ($scope,$location, $http, ErrorService, $rootScope) {
        $scope.brand = 'AirCnC';
        $scope.links = [
            {name: 'cars', url: '/cars', authRequired: false},
            // coming soon
            // {name: 'map', url: '/map'},
            {name: 'newcar', url: '/newcar', authRequired: false}
        ];
        var updateUrl = function() {
            // get current url
            $scope.url = $location.path();
        };
        $scope.isLoggedIn = $rootScope.logged;
        $scope.$watch(function() {return $rootScope.logged;}, function() {
            $scope.isLoggedIn = $rootScope.logged;
        });


        // watch path
        // care: isn't property of the scope
        $scope.$watch(function(){
            return $location.path();
        }, updateUrl);

        $scope.logout = function () {
            $http.get('/logout')
                .success(function (data, status, headers, config) {
                    $rootScope.logged = false;
                    console.log('user successfuly loged out');
                    ErrorService.setError('User successfully logged out');
                    $location.path('/login');
                }).error(function (data, status, headers, config) {
                    ErrorService.setError('Error occured while logging out');
                    console.log("Error occured while loging out");
                });
        };

    }])
    .controller('AccountCtrl', ['$scope','user','cars', function ($scope,user,cars) {
        $scope.user = user;
        $scope.ownedCars = cars;
        console.debug(cars);
    }])
    .controller('EditAccountCtrl', ['$scope','user','$location', function ($scope,user,$location) {
        $scope.user=user;
        $scope.save = function() {
            $scope.user.$save(function(usr) {
                $location.path('/account');
            });
        }
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
                    $rootScope.logged = true;
                    $location.path('/account');
                }).error(function (data, status, headers, config) {
                    $rootScope.logged = false;
                    console.log("Error occured while sign up");
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
                    $rootScope.logged = true;
                    console.log("login worked fine");
                    $location.path('/account');
                }).error(function (data, status, headers, config) {
                    $rootScope.logged = false;
                    console.log("Error occured while login");
                });
        };
    }])
    .controller('RootCtrl', ['$scope', '$location', 'ErrorService', function ($scope, $location, ErrorService) {
        $scope.errorService = ErrorService;
        $scope.$watch('ErrorService', function(v) {
            $scope.errorService = ErrorService;
        }, true);

        $scope.$on('event:loginRequired', function() {
            $location.path('/login');
        });
    }])
    .controller('CarCtrl', ['$scope','$http','ErrorService', function ($scope, $http, ErrorService) {
        // debugging : get database
        $scope.cars = cars;
        $http({
            method: 'GET',
            url: '/api/cars'
        }).success(function (data, status, headers, config) {
            data.forEach(function(c) {
                c.dateFrom = Date.parse(c.dateFrom);
                c.dateTo = Date.parse(c.dateTo);
            });
            $scope.carsDB = data;

        }).error(function (data, status, headers, config) {
            throw new Error('Cannot get cars DB!');
        });

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
                console.log("Success! received %d cars from server", data.length);
                if (data.length > 0) {
                    cars = data;
                    ErrorService.clear();
                }
                else {
                    ErrorService.setError('Sorry, no car available for that query');
                }
                $scope.cars = cars;
            }).error(function (data, status, headers, config) {
                cars = null;
                $scope.cars = null;
                throw new Error('Cannot get cars!');
            });
        };
    }])
    .controller('MapCtrl', function ($scope) {
        // write Ctrl here
    })
    .controller('NewCarCtrl',[ '$scope','$http','$location','ErrorService', function ($scope,$http,$location,ErrorService) {
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
                    ErrorService.setError('Thanks, the car ' +
                                          config.data.name +
                                          ' has been registered!');
                    $location.path('/account');
                }).error(function (data, status, headers, config) {
                    ErrorService.setError('An error has occured while '+
                                          'registering the car ' +
                                          config.data.name);
                });
        };

    }]);
