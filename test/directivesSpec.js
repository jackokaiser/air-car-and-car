'use strict';

/* jasmine specs for directives go here */



xdescribe('directives', function() {
  beforeEach(module('myApp.directives'));

  describe('daterange', function() {
    it('should set date', function() {
      module(function($provide) {
        // $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span daterange></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});
