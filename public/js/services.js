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
      return deferred.promise;
    }
    , hasAbility: function(ability) {
      var deferred = q.defer();
      var promise = this.getAbilities();
      promise.then(function(abilities) {
        if (abilities.length == 0) {
          deferred.reject(false);
        }
        deferred.resolve(_.chain(abilities)
            .pluck("title")
            .contains(ability)
            .value());
        })
      return deferred.promise;

    }
    ,isLoggedIn: function() {
      var deferred = q.defer();
      var promise = this.verify();
      promise.then(function(verified) {
        if (!verified) {
          deferred.reject(false);
        }
        deferred.resolve(true);

      });

      return deferred.promise;
    }

    ,verify: function() {
      var deferred = q.defer();
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

// TODO: Separate file
alsbooks.factory('userService', ['$http','$q', function(http, q) {

  // TODO: Send back propery 50* HTTP codes
  return {
    update: function(user) {
      var deferred = q.defer();
      http.post('/api/manage/users/update', user)
        .success(function(data) {
          if (data.success) {
            toastr.success("User updated!")
            deferred.resolve(true)
          }
        })
        .error(function(data) {
          toastr.error("Something awful happened!")
          deferred.reject(false)
        })
      return deferred.promise;
    }

    ,getUsers: function() {
      var deferred = q.defer();
      http.get('/api/manage/users/list')
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(data) {
          deferred.reject(data);
        })
     return deferred.promise;
    }
    ,signup: function(user) {
      var deferred = q.defer();
      http.post('/api/manage/users/create', user)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(data) {
          deferred.reject(data);
        })
      return deferred.promise;
    }
  }
}]);

alsbooks.factory('memberService', ['$http','$q', function(http, q) {

  // TODO: Send back propery 50* HTTP codes
  return {
    archive: function(memberId) {
      var deferred = q.defer();
      http.delete('/api/archive/publications/' + memberId)
        .success(function(data) {
          toastr.success("Successfully archived member publications")
          deferred.resolve(data)
        })
        .error(function(err) {
          toastr.error("Something awful happened!")
          deferred.reject(data)
        });
      return deferred.promise;
    }
  }
}]);

alsbooks.factory('articleService', ['$http','$q', function(http, q) {

  // TODO: Send back propery 50* HTTP codes
  return {
    list: function(memberId) {
      var deferred = q.defer();
      http.get('/api/articles/list')
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(err) {
          deferred.reject(data)
        });
      return deferred.promise;
    },
    post: function(article) {
      var deferred = q.defer();
      http.put('/api/articles/post', article)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(data) {
          deferred.reject(data);
        })
      return deferred.promise;
    },
    put: function(article) {
      var deferred = q.defer();
      http.put('/api/articles/add', article)
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(data) {
          deferred.reject(data);
        })
      return deferred.promise;

    }
  }
}]);
