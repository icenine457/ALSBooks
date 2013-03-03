'use strict';

// Application definition {{{
angular.module('alsbooks', ['alsbooks.filters', 'alsbooks.services', 'alsbooks.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: LandingCtrl
      }).
      when('/publications', {
        templateUrl: 'partials/publications',
        controller: PublicationsCtrl
      }).
      when('/importMembers', {
        templateUrl: 'partials/importMembers'
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
      when('/publications/edit/:memberId/:pubId/modal', {
        templateUrl: 'partials/modals/editPublication',
        controller: EditPublicationCtrl
      }).
      when('/publications/new/:memberId', {
        templateUrl: 'partials/editPublication',
        controller: EditPublicationCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

// }}}
