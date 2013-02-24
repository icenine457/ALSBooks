'use strict';

/* Directives */

var alsbooks = angular.module('alsbooks.directives', []);

alsbooks.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);

alsbooks.directive('ngVisible', function() {
  return function(scope, element, attr) {
    scope.$watch(attr.ngVisible, function(visible) {
      element.css('display', visible ? '' : 'none');
    });
  };
});

alsbooks.directive('eat-click', function() {
  return {
    link: function(scope, element, attrs) {
      element.click(function(event) {
        event.preventDefault();
      });
    }
  }
})
