'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var alsbooks = angular.module('alsbooks.services', ['ngCookies']);
alsbooks.value('version', '0.1');

alsbooks.factory('auth', ['$cookies', '$rootScope', '$http','$q', '$timeout',  function(cookies, rootScope, http, q, timeout) {

  return {
    getAbilities: function() {
      var deferred = q.defer();
      var self = this;
      timeout(function() {
        if (cookies['alsbooks.user']) {
          deferred.resolve(JSON.parse(cookies['alsbooks.user'].substr(2)).abilities)
        }
        else {
          var promise = self.verify();
          promise.then(function(verified) {
            if (!verified) {
              deferred.reject([]);
            }
            deferred.resolve(JSON.parse(cookies['alsbooks.user'].substr(2)).abilities)
          });

        }
      }, 100);
      return deferred.promise;
    }
    , hasAbility: function(ability) {
      var deferred = q.defer();
      var promise = this.getAbilities();
      timeout(function() {
        promise.then(function(abilities) {
          if (abilities.length == 0) {
            deferred.reject(false);
          }
          deferred.resolve(_.chain(abilities)
              .pluck("title")
              .contains(ability)
              .value());
          })
        }
      , 100);
      return deferred.promise;

    }
    ,isLoggedIn: function() {
      var deferred = q.defer();
      var promise = this.verify();
      timeout(function() {
        promise.then(function(verified) {
          if (!verified) {
            deferred.reject(false);
          }
          deferred.resolve(true);

        });

      }, 100);
      return deferred.promise;
    }

    ,verify: function() {
      var deferred = q.defer();
      timeout(function() {
        http.post('/api/users/verify', cookies["connect.sid"])
          .success(function(res) {
            if (res.success) {
              return deferred.resolve(true);
            }
            deferred.reject(false);
          })
          .error(function(res) {
            deferred.reject(false);
          });
      }, 100);

      return deferred.promise;

    }
    ,login: function(cb, user) {
      http.post('/api/users/login', user).
      success(function(res) {
        if (res.errors) {
          cb(res.errors)
          return;
        }
        if (res.success) {
          toastr.success("Log-in successful!<br />Welcome " + res.user.name + ".");
          rootScope.$broadcast('login');
        }
      })

    }
    ,logout: function(cb) {
      http.post('/api/users/logout').
        success(function() {
          toastr.success("Successfully logged out.");
          rootScope.$broadcast('logout');
          cb();
        })
    }
  }
}]);
