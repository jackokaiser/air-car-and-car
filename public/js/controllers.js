'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('NavCtrl', function ($scope) {
        $scope.brand = 'AirCnC';
        $scope.links = [
            {name: 'cars', url: '/cars'},
            {name: 'map', url: '/map'},
            {name: 'newcar', url: '/newcar'}
        ];
        $scope.selected = 0;
        $scope.selectLink = function(i) {
            $scope.selected=i;
        };

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

            $scope.carsDB = data.cars;
        }).error(function (data, status, headers, config) {
            throw new Error('Cannot get cars DB!');
        });

        var datepickerOpt = {
            format : 'dd/mm/yyyy',
            startDate : 'd'
            // autoclose : true,
            // clearBtn : true,
            // todayHighlight : true
        };

        $('#datepicker').datepicker(datepickerOpt);

        var toDate = function(s) {
            var t = s.split('/');
            return new Date(t[2],t[1],t[0]);
        };

        $scope.message = '';
        $scope.carQuery = function ()
        {
            // forge query
            var query = {
                dateFrom : toDate($scope.dateQueryFrom).getTime(),
                dateTo : toDate($scope.dateQueryTo).getTime(),
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
