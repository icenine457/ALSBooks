'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('alsbooks.services', []).
  value('version', '0.1');

alsbooks.factory('authProvider', ['$cookies', function() {
  return {
    get: function() {
      return $cookies['alsBooks.user.abilities'];
    }
    ,isLoggedIn: function() {
      return !(typeof($cookies["alsbooks.loggedIn"]) === "undefined");
    }
  }
}]);
