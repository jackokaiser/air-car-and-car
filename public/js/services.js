'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource'])
    .factory('ErrorService', function() {
        return {
            errorMessage: null,
            setError: function(msg) {
                this.errorMessage = msg;
            },
            clear: function() {
                this.errorMessage = null;
            }
        };
    })
    .factory('User', ['$resource',function($resource) {
        return $resource('/api/account/:id',{id: '@id'});
    }])
    .factory('UserLoader', ['User','$q',function(User,$q) {
        return function() {
            var delay = $q.defer();
            // login is server side, the server knows what data to retrieve
            User.get({},function(user) {
                delay.resolve(user);
            }, function() {
                delay.reject('Unable to fetch user info');
            });
            return delay.promise;
        };
    }])
    .factory('Car', ['$resource',function($resource) {
        return $resource('/api/cars/:id',{id: '@id'});
    }])
    .factory('CarLoader', ['Car','$q',function(Car,$q) {
        return function(queryConstraint) {
            var delay = $q.defer();

            Car.query(queryConstraint,function(cars) {
                delay.resolve(cars);
            }, function() {
                delay.reject('Unable to fetch wanted cars');
            });
            return delay.promise;
        };
    }])
    .factory('CarLoaderId', ['Car','$q', '$route', function(Car,$q,$route) {
        return function() {
            var delay = $q.defer();

            Car.get( { id: $route.current.params.carId },
                     function(car) {
                         delay.resolve(car);
                     }, function() {
                         delay.reject('Unable to fetch wanted cars');
                     });
            return delay.promise;
        };
    }])
    .config(function($httpProvider) {
        $httpProvider.responseInterceptors.push('errorHttpInterceptor');
    })
// register the interceptor as a Services
// intercepts ALL angular ajax HTTP calls
    .factory('errorHttpInterceptor',
             function ($q, $location, ErrorService, $rootScope) {
                 return function (promise) {
                     return promise.then(function (response) {
                         return response;
                     }, function(response) {
                         if (response.status === 401) {
                             $rootScope.$broadcast('event:loginRequired');
                             ErrorService.setError('You need to log in');
                         } else if (response.status === 409) {
                             ErrorService.setError('An user with '+
                                                   'this email already exist');
                         } else if (response.status === 400) {
                             ErrorService.setError("The password you submitted doesn't match our record");
                         } else if (response.status === 422) {
                             ErrorService.setError("Form is not valid. Passwords must match and have at least 4 characters");
                         } else if (response.status >= 400 &&
                                    response.status < 500) {
                             ErrorService.setError('Server was unable to '+
                                                   'find what you were looking for... Sorry!');
                         } else if (response.status === 500) {
                             ErrorService.setError('Server encountered '+
                                                   'some issues');
                         }

                         return $q.reject(response);
                     });
                 };
             });
