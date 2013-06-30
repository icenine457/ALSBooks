'use strict';

// Application definition {{{
var modules = [
  'alsbooks.filters',
  'alsbooks.services',
  'alsbooks.directives',
  'angular-underscore',
  'ngCookies',
  'ngRoute',
  'ui.bootstrap',
]
var alsbooks = angular.module('alsbooks', modules).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: LandingCtrl
      }).
      when('/login', {
        templateUrl: 'partials/login',
        controller: LoginCtrl
      }).
      when('/signup', {
        templateUrl: 'partials/signup',
        controller: SignupCtrl
      }).
      when('/publications/new/:memberId', {
        templateUrl: 'partials/editPublication',
        controller: EditPublicationCtrl
      }).
      when('/publications', {
        templateUrl: 'partials/publications',
        controller: ListCtrl
      }).
      when('/publications/:page/:perPage', {
        templateUrl: 'partials/publications',
        controller: ListCtrl
      }).
      when('/importMembers', {
        templateUrl: 'partials/importMembers'
      }).
      when('/members', {
        templateUrl: 'partials/viewMembers',
        controller: ListCtrl
      }).
      when('/members/:page/:perPage', {
        templateUrl: 'partials/viewMembers',
        controller: ListCtrl
      }).
      when('/members/:id', {
        templateUrl: 'partials/editMember',
        controller: EditMemberCtrl
      }).
      when('/publications/edit/:memberId/:pubId', {
        templateUrl: 'partials/editPublication',
        controller: EditPublicationCtrl
      }).
      when('/publications/view/:memberId/:pubId', {
        templateUrl: 'partials/viewPublication',
        controller: ViewPublicationCtrl
      }).
      when('/publications/edit/:memberId/:pubId/modal', {
        templateUrl: 'partials/modals/editPublication',
        controller: EditPublicationCtrl
      }).
      when('/webSearch/google/:memberId', {
        templateUrl: 'partials/google',
        controller: SearchGoogleCtrl
      }).
      when('/webSearch', {
        templateUrl: 'partials/webSearch',
        controller: ListCtrl
      }).
      when('/contact', {
        templateUrl: 'partials/contact',
        controller: ContactCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }])

// }}}
