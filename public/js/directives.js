'use strict';

/* Directives */


angular.module('alsbooks.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
angular.module('alsbooks.filters', []).
  directive('ngVisible', function() {
    return function(scope, element, attr) {
      scope.$watch(attr.ngVisible, function(visible) {
      element.css('display', visible ? '' : 'none');
    });
  };
});
