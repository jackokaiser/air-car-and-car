'use strict';

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
            {name: 'map', url: '/map'},
            {name: 'newcar', url: '/newcar'}
        ];
        var updateLink = function() {
            // find index of the link in the array
            $scope.selected=$scope.links.findIndex(function(elem) {
                return elem.url === $location.path();
            });
        };
        // watch path
        // care: isn't property of the scope
        $scope.$watch(function(){
            return $location.path()
        }, updateLink);

    })
    .controller('AppCtrl', function ($scope, $http) {

        $http({
            method: 'GET',
            url: '/api/name'
        })
            .success(function (data, status, headers, config) {
                $scope.name = data.name;
            })
            .error(function (data, status, headers, config) {
                $scope.name = 'Error!';
            });

    })
    .controller('MyCtrl1', function ($scope, $http) {
        // debugging : get database
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
            $scope.cars = null;
            // forge query
            var query = {
                dateFrom : new Date($scope.dateQueryFrom),
                dateTo : new Date($scope.dateQueryTo),
                location : $scope.locationQuery
            };
            // get request to server
            $http({
                method: 'GET',
                url: '/api/cars',
                params: query
            }).success(function (data, status, headers, config) {
                console.log("Success! received %d cars from server", data.cars.length);
                if (data.cars.length > 0) {
                    $scope.cars = data.cars;
                    $scope.message = '';
                }
                else {
                    $scope.message = 'Sorry, no car available for that query';
                }
            }).error(function (data, status, headers, config) {
                throw new Error('Cannot get cars!');
            });
        };
    })
    .controller('MyCtrl2', function ($scope) {
        // write Ctrl here
    })
    .controller('MyCtrl3', function ($scope,$http) {
        // write Ctrl here
        $scope.message='';
        $scope.car = {};
        $scope.addCar = function()
        {
            // push to server
            var optionsObj = {
                method : 'POST',
                url : '/api/cars',
                data : $scope.car
            };
            $http(optionsObj).success(function (data, status, headers, config) {
                $scope.message = 'Thanks, the car ' + config.data.name +
                    ' has been registered!';
            }).error(function (data, status, headers, config) {
                $scope.message = 'An error has occured while '+
                    'registering the car ' + config.data.name;
            });
            // $location.url('/');
        };

    });
