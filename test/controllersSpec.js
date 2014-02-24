'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    var $scope, ctrl;

  beforeEach(module('myApp.controllers'));
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual,expected);
            }
        });
    });
    it('should ok',function(){
        expect(1).toEqual(1);
    });

});
