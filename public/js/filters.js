'use strict';

// Filters {{{

var alsbooks = angular.module('alsbooks.filters', [])
alsbooks.filter('interpolate', function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
});
alsbooks.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++) input.push(i);
    return input;
  };
});

// }}}
