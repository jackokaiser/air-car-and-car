'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('myApp.services'));


    describe('ErrorService', function() {
        it('should be able to set and clear message', inject(function(ErrorService) {
            var msg = 'this is an error!';
            ErrorService.setError(msg);
            expect(ErrorService.errorMessage).toEqual(msg);
            ErrorService.clear();
            expect(ErrorService.errorMessage).toBeNull();
        }));
    });


    describe('User', function() {
        it('should get resource', inject(function(User,_$httpBackend_) {
            var usrId = 5;
            _$httpBackend_.expectGET('/api/account/'+usrId).respond(
                new User(usrId)
            );
            User.get({id : usrId});
            _$httpBackend_.flush();
        }));
    });

    describe('Car', function() {
        it('should get resource', inject(function(Car,_$httpBackend_) {
            var carId = 5;
            _$httpBackend_.expectGET('/api/cars/'+carId).respond(
                new Car(carId)
            );
            Car.get({id : carId});
            _$httpBackend_.flush();
        }));
    });



});
