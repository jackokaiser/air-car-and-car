'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    var $scope, ctrl, mockBackend;



    beforeEach(module('myApp'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual,expected);
            }
        });
    });

    describe('when user unlogged',function() {
        beforeEach(inject(function(_$httpBackend_) {
            mockBackend = _$httpBackend_;
            // say, user isn't logged in
            mockBackend.whenGET('/loggedin').respond('0');
        }));

        describe('NavCtrl:',function() {
            var location;
            beforeEach(inject(function($location,$controller,$rootScope,ErrorService) {
                location = $location;
                location.path('/cars');
                $scope=$rootScope.$new();
                ctrl = $controller('NavCtrl', {
                    $scope : $scope,
                    $location : location,
                    ErrorService : ErrorService,
                    $rootScope : $rootScope
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
    });
    describe('when user is logged',function() {
        beforeEach(inject(function(_$httpBackend_) {
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
        }));

        describe('NavCtrl:',function() {
            var location;
            var rootScope;
            beforeEach(inject(function($location,$controller,$rootScope,ErrorService) {
                rootScope = $rootScope;
                location = $location;
                location.path('/cars');
                $scope=$rootScope.$new();
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
    });
});
