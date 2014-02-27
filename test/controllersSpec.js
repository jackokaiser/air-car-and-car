'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    var $scope, ctrl, mockBackend;



    // mock initialization module
    // prevent early stage get request
    angular.module('init-module', function () {});

    beforeEach(module('myApp'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual,expected);
            }
        });
    });

    describe('when user unlogged',function() {
        var rootScope;
        beforeEach(inject(function(_$httpBackend_,$rootScope) {
            mockBackend = _$httpBackend_;
            // say, user isn't logged in
            mockBackend.whenGET('/loggedin').respond('0');
            rootScope=$rootScope;
            rootScope.logged=false;
        }));

        describe('NavCtrl',function() {
            var location;
            beforeEach(inject(function($location,$controller,ErrorService) {
                location = $location;
                location.path('/cars');
                $scope=rootScope.$new();
                ctrl = $controller('NavCtrl', {
                    $scope : $scope,
                    $location : location,
                    ErrorService : ErrorService,
                    $rootScope : rootScope
                });
            }));

            it('should have some links', function() {
                expect($scope.links).toBeDefined();
            });
            it('should have brand name', function() {
                expect($scope.brand).toEqual('AirCnC');
            });
            it('should point to location', function() {
                expect($scope.url).toEqual('/cars');
            });
        });

        describe('SignupCtrl', function() {
            var location;

            beforeEach(inject(function($location,$controller) {
                location = $location;
                location.path('/cars');
                $scope=rootScope.$new();
                ctrl = $controller('SignupCtrl', {
                    $scope : $scope,
                    $location : location,
                    $rootScope : rootScope
                });
            }));

            it('should be able to signup user', function() {
                mockBackend.expectPOST('/signup').respond(200,'OK');
                location.path('/test');
                $scope.signupUser();
                mockBackend.flush();
                expect(location.path()).toEqual('/account');
                expect(rootScope.logged).toBeTruthy();
            });
        });

        describe('CarCtrl', function() {
            var availableCars;
            var dateRange = {
                dateFrom : "2014-02-22T13:00:00Z",
                dateTo :"2014-03-15T13:00:00Z"
            };
            // instanciate a car array we will return
            beforeEach(inject(function(Car) {
                availableCars = [
                    new Car({
                    id : 0,
                    name : 'TOYOTA',
                    location : 'MELBOURNE',
                    dateFrom : "2014-02-25T13:00:00Z",
                    dateTo : "2014-02-27T13:00:00Z",
                    price : '45'
                }),
                new Car({
                    id : 1,
                    name : 'FORD FALCON',
                    location : 'MELBOURNE',
                    dateFrom : "2014-03-05T13:00:00Z",
                    dateTo : "2014-03-13T13:00:00Z",
                    price : '22'
                })
            ];
            }));

            // instanciate controller
            beforeEach(inject(function($controller,CarLoader) {
                $scope=rootScope.$new();
                $scope.dateRange = {};
                $scope.dateRange = dateRange;
                $scope.locationQuery = 'Melbourne';

                ctrl = $controller('CarCtrl', {
                    $scope : $scope,
                    CarLoader : CarLoader
                });
            }));

            it('should load available car', function () {
                mockBackend.expectGET('/api/cars?dateFrom=1393074000000'+
                                     '&dateTo=1393074000000'+
                                      '&location=Melbourne')
                    .respond(availableCars);
                $scope.carQuery();
                mockBackend.flush();
                expect($scope.cars).toEqual(availableCars);
            });


        });
    });
    describe('when user is logged',function() {
        var rootScope;
        beforeEach(inject(function(_$httpBackend_,$rootScope) {
            // we have a fake user
            var user = { "__v" : 0,
                         "_id" : "5302c1116b55df7d11f39181",
                         "email" : "toto@gmail.com",
                         "password" : "$2a$05$YyYZdgT4CVuhw6q1bx1dhOF9K9jHxriwMZnXSGyu.nEFmTz2uvEny",
                         "profile" : { "gender" : "male",
                                       "location" : "melbourne",
                                       "name" : "TOto",
                                       "picture" : "",
                                       "website" : "toto.com" },
                         "tokens" : [ ]
                       };

            mockBackend = _$httpBackend_;
            mockBackend.whenGET('/loggedin').respond(user);
            rootScope=$rootScope;
            rootScope.logged=true;
        }));

        describe('NavCtrl',function() {
            var location;
            beforeEach(inject(function($location,$controller,ErrorService) {
                location = $location;
                location.path('/cars');
                $scope=rootScope.$new();
                ctrl = $controller('NavCtrl', {
                    $scope : $scope,
                    $location : location,
                    ErrorService : ErrorService,
                    $rootScope : rootScope
                });
            }));

            it('should be logged', function() {
                expect(rootScope.logged).toBeTruthy();
            });
            it('should be able to logout', function() {
                location.path('/test');
                mockBackend.expectGET('/logout').respond(200,'OK');
                $scope.logout();
                mockBackend.flush();
                expect(location.path()).toEqual('/login');
                expect(rootScope.logged).toBeFalsy();
            });

        });
        describe('NewCarCtrl',function() {
            var location;
            var car;
            var dateRange;
            beforeEach(inject(function($location,
                                       $controller,
                                       ErrorService,
                                       Car) {
                dateRange = {
                    dateFrom : "2014-02-25T13:00:00Z",
                    dateTo : "2014-02-27T13:00:00Z"
                };
                car = {
                    price : '22',
                    name : "Station Wagon"
                };
                location = $location;
                location.path('/newCar');
                $scope=rootScope.$new();
                ctrl = $controller('NewCarCtrl', {
                    $scope : $scope,
                    $location : location,
                    ErrorService : ErrorService,
                    Car : Car
                });
                angular.extend($scope.car,car);
                $scope.dateRange = dateRange;

            }));

            it('should add new car and redirect',function () {
                location.path('/test');
                car.price = parseInt(car.price,10);
                mockBackend.expectPOST('/api/cars',
                                       angular.extend(car,dateRange))
                    .respond(200,'OK');
                $scope.addCar();
                mockBackend.flush();
                expect(location.path()).toEqual('/account');
            });

        });

    });
});
