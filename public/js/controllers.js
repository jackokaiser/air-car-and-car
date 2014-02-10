'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
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
        $scope.message = '';
        $scope.carQuery = function ()
        {
            // smith query
            var query = {
                dateFrom : new Date($scope.dateQueryFrom).getTime(),
                dateTo : new Date($scope.dateQueryTo).getTime(),
                location : $scope.locationQuery
            };
            // get request to server
            $http({
                method: 'GET',
                url: '/api/cars',
                params: query
            })
                .success(function (data, status, headers, config) {
                    if (data.cars.length > 0)
                        $scope.cars = data.cars;
                    else
                        $scope.message = 'Sorry, no car available for that query';
                })
                .error(function (data, status, headers, config) {
                    throw new Error('Cannot get cars!');
                });
        };
    })
    .controller('MyCtrl2', function ($scope) {
        // write Ctrl here
    })
    .controller('MyCtrl3', function ($scope,$location) {
        // write Ctrl here
        $scope.message='';
        $scope.addCar = function()
        {
            // push to server
            $scope.message = 'Thanks, the car ' + $scope.car.name +
                ' has been registered!';
            // $location.url('/');
        };

    });
