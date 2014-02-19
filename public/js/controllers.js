'use strict';

// Models

// the car array
var localCarArray;
// the car instance for registration
var localCar;

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
            {name: 'Cars', url: '/cars', authRequired: false},
            // coming soon
            // {name: 'map', url: '/map'},
            {name: 'New car', url: '/newcar', authRequired: false}
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
    .controller('CarCtrl', ['$scope','$http','ErrorService', 'CarLoader', function ($scope, $http, ErrorService, CarLoader) {
        $scope.cars = localCarArray;
        $scope.carQuery = function ()
        {
            // drop previous cars
            localCarArray = null;
            // forge query
            var query = {
                dateFrom : new Date($scope.dateRange.dateFrom).getTime(),
                dateTo : new Date($scope.dateRange.dateFrom).getTime(),
                location : $scope.locationQuery
            };

            // promise query
            CarLoader(query).then(function(carsResource) {
                console.log("Success! received %d cars from server",
                            carsResource.length);
                $scope.cars = carsResource;
                localCarArray = carsResource;
                if (carsResource.length > 0) {
                    ErrorService.clear();
                }
                else {
                    ErrorService.setError('Sorry, no car available '+
                                          'for that query');
                }
            }, function(err) {
                localCarArray = null;
                $scope.cars = null;
                throw new Error('Cannot get cars! '+err);
            });
        };
    }])
    .controller('MapCtrl', function ($scope) {
        // write Ctrl here
    })
    .controller('ViewCarCtrl',['$scope', 'car', function ($scope,car) {
        $scope.car = car;
    }])
    .controller('EditCarCtrl',['$scope', 'car', 'ErrorService', '$location', function ($scope,car,ErrorService,$location) {
        $scope.car = car;
        $scope.addCar = function()
        {
            // in case user added non digit
            $scope.car.price = parseInt($scope.car.price,10);
            $scope.car.dateFrom = $scope.dateRange.dateFrom;
            $scope.car.dateTo = $scope.dateRange.dateTo;

            // push to server
            $scope.car.$save({id : car._id});
            console.log('Car Saved');
            ErrorService.setError('Thanks, the car ' +
                                  $scope.car.name +
                                  ' has been updated!');
            $location.path('/account');
        }
    }])
    .controller('NewCarCtrl',[ 'Car','$scope','$http','$location','ErrorService', function (Car,$scope,$http,$location,ErrorService) {
        // make it a resource
        $scope.car = new Car(localCarArray);
        $scope.addCar = function()
        {
            // in case user added non digit
            $scope.car.price = parseInt($scope.car.price,10);
            $scope.car.dateFrom = $scope.dateRange.dateFrom;
            $scope.car.dateTo = $scope.dateRange.dateTo;

            // push to server
            $scope.car.$save();
            console.log('Car Saved');
            ErrorService.setError('Thanks, the car ' +
                                  $scope.car.name +
                                  ' has been registered!');
            $location.path('/account');
        };

    }]);
