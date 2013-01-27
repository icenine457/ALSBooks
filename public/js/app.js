'use strict';


// Declare app level module which depends on filters, and services
angular.module('alsbooks', ['alsbooks.filters', 'alsbooks.services', 'alsbooks.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/importMembers', {
        templateUrl: 'partials/importMembers',
        controller: ImportMemberCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
