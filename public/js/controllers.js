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
        $http({
            method: 'GET',
            url: '/api/cars'
        })
            .success(function (data, status, headers, config) {
                $scope.cars = data.cars;
            })
            .error(function (data, status, headers, config) {
                throw new Error('Cannot get cars!');
            });
        $scope.test = [ 1,2,3,4,5 ];

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
