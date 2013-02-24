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
      when('/members', {
        templateUrl: 'partials/viewMembers',
        controller: MembersCtrl
      }).
      when('/members/:id', {
        templateUrl: 'partials/editMember',
        controller: EditMemberCtrl
      }).
      when('/publications/edit/:memberId/:pubId', {
        templateUrl: 'partials/editPublication',
        controller: EditPublicationCtrl
      }).
      when('/publications/new/:memberId', {
        templateUrl: 'partials/editPublication',
        controller: EditPublicationCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
