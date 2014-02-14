'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .factory('ErrorService', function() {
        return {
            errorMessage: null,
            setError: function(msg) {
                this.errorMessage = msg;
            },
            clear: function() {
                this.errorMessage=null;
            }
        };
    })
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
                         } else if (response.status >= 400 &&
                                    reponse.status < 500) {
                             ErrorService.setError('Server was unable to '+
                                                   'find what you were looking for... Sorry!');
                         }
                         return $q.reject(response);
                     });
                 };
             });
    // // this factory is only evaluated once, and authHttp is memorized.
    // // That is, future requests to authHttp service will return
    // // the same instance of authHttp
    // .factory('authHttp', function($http, Authentication) {
    //     var authHttp = {};

    //     // append the right header to the request
    //     var extendHeaders = function(config) {
    //         config.headers = config.headers || {};
    //         config.headers['Authorization'] = Authentication.getTokenType()+
    //             ' ' + Authentication.getAccessToken();
    //     };
    //     // do this for each $http call
    //     angular.forEach(['get','delete','head','jsonp'], function(name) {
    //         authHttp[name] = function(url,config) {
    //             config = config || {};
    //             extendHeaders(config);
    //             return $http[name](url,config);
    //         };
    //     });
    //     return authHttp;
    // });