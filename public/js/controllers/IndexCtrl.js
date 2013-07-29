alsbooks.controller('IndexCtrl', function($scope, $http, $location, $cookies, $q, $rootScope, auth) {

  // WARNING: This is only to be used for view logic.
  // ALL sensitive data must be authenticated with the server

  var verifyAbilities = function() {
    auth.hasAbility('canViewMembers').then(function(canDo) {
      $scope.canViewMembers = canDo
      $scope.tabs['member'].visible = ( $scope.loggedIn && canDo )
    })

    auth.hasAbility('canWebSearch').then(function(canDo) {
      $scope.canWebSearch = canDo
      $scope.tabs['webSearch'].visible = ( $scope.loggedIn && canDo )
    })

    auth.hasAbility('canManageUsers').then(function(canDo) {
      $scope.canManageUsers = canDo
      $scope.tabs['users'].visible = ( $scope.loggedIn && canDo )
    })

  }


  // TODO: Retrieve from server-side API
  $scope.tabs = {
    login: {
      navItem: "login",
    },
    logout: {
      navItem: "logout",
    },
    member: {
      navItem: "members",
      visible: $scope.loggedIn && $scope.canViewMembers
    },
    publications: {
      navItem: "publications",
      visible: true,
    },
    webSearch: {
      navItem: "webSearch",
      visible: $scope.loggedIn && $scope.canWebSearch
    },
    users: {
      navItem: "users",
      visible: $scope.loggedIn && $scope.canManageUsers
    },
    contact: {
      navItem: "contact",
      visible: true,
    }
  }

  auth.isLoggedIn().then(function(loggedIn) {
    $scope.loggedIn = loggedIn
    verifyAbilities()
  })

  var focusTab = function() {
    _.each(Object.keys($scope.tabs), function(tab) {
      var re = new RegExp("\/" + tab);
      $scope.tabs[tab].navClass = ($location.path().match(re) !== null ? "active" : "");
    });
  }

  focusTab()

  $scope.logout = function() {
    auth.logout(function() {
      $scope.loggedIn = false;
      $scope.tabs['logout'].visible = false;
    });
  }

  $scope.$on('login', function() {
    $location.url('/publications');
    auth.isLoggedIn().then(function() {
      verifyAbilities()
      $scope.loggedIn = true;
      return;
    }, function() {
      return $scope.loggedIn = false;
    });
  });

  $scope.$on('logout', function() {
    $location.url('/publications');
    $scope.tabs['users'].visible = false
    $scope.tabs['webSearch'].visible = false
    $scope.tabs['member'].visible = false
  });

  $scope.$on('changeTab', function() {
    focusTab()
  });

});
