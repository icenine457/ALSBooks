alsbooks.controller('IndexCtrl', function($scope, $http, $location, $cookies, $rootScope, auth) {

  // WARNING: This is only to be used for view logic.
  // ALL sensitive data must be authenticated with the server
  $scope.loggedIn = auth.isLoggedIn();

  // TODO: Retrieve from server-side API
  var generateTabs = function() {
    var tabs = {
      login: {
        navItem: "login",
        visible: !$scope.loggedIn,
      },
      logout: {
        navItem: "logout",
        visible: $scope.loggedIn,
      },
      member: {
        navItem: "members",
        visible: $scope.loggedIn && auth.hasAbility('canViewMembers'),
      },
      publications: {
        navItem: "publications",
        visible: true,
      },
      webSearch: {
        navItem: "webSearch",
        visible: $scope.loggedIn && auth.hasAbility('canWebSearch'),
      },
      signup: {
        navItem: "signup",
        visible: $scope.loggedIn && auth.hasAbility('canManageUsers'),
      },
      contact: {
        navItem: "contact",
        visible: true,
      }
    }

    _.each(tabs, function(tab) {
      var re = new RegExp("\/" + tab.navItem);
      tab.navClass = $location.path().match(re) !== null ? "active" : false;
    });
    return tabs;

  }

  $scope.logout = function() {
    auth.logout(function() {
      $scope.loggedIn = false;
      $scope.tabs = generateTabs()
    });
  }

  $scope.$on('login', function() {
    $location.url('/publications');
    auth.isLoggedIn().then(function() {
      $scope.loggedIn = true;
      $scope.tabs = generateTabs()
      return;
    }, function() {
      return $scope.loggedIn = false;
    });
  });

  $scope.$on('logout', function() {
    $scope.tabs = generateTabs()
    $location.url('/publications');
  });

  $scope.tabs = generateTabs()
  $scope.$on('changeTab', function() {
    $scope.tabs = generateTabs()
  });

});
