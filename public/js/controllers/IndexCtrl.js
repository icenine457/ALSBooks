alsbooks.controller('IndexCtrl', function($scope, $http, $location, $cookies, $rootScope, auth) {

  // WARNING: This is only to be used for view logic.
  // ALL sensitive data must be authenticated with the server
  $scope.loggedIn = auth.isLoggedIn();

  // Sets the active tab in the UI
  // $scope.getActiveTab = function(navDetails, navPoint) {
  //   var re = new RegExp("\/" + navDetails.navItem);
  //   $scope.tabs[navPoint].navClass = $location.path().match(re) !== null ? "active" : false;
  // };

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
        visible: $scope.loggedIn,
      },
      publications: {
        navItem: "publications",
        visible: true,
      },
      webSearch: {
        navItem: "webSearch",
        visible: $scope.loggedIn,
      },
      signup: {
        navItem: "signup",
        visible: $scope.loggedIn,
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
  });

  $scope.tabs = generateTabs()
  $scope.$on('changeTab', function() {
    $scope.tabs = generateTabs()
  });

});
