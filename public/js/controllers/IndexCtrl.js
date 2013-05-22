function IndexCtrl($scope, $http, $location) {

  // Sets the active tab in the UI
  $scope.getActiveTab = function(navDetails, navPoint) {
    var re = new RegExp("\/" + navDetails.navItem);
    console.log($location.path())
    $scope.tabs[navPoint].navClass = $location.path().match(re) !== null ? "active" : false;
  };

  $scope.tabs = {
    login: {
      navItem: "login",
      navClass: ""
    },
    member: {
      navItem: "members",
      navClass: ""
    },
    publications: {
      navItem: "publications",
      navClass: ""
    },
    webSearch: {
      navItem: "webSearch",
      navClass: ""
    }
  }
  $scope.$on('changeTab', function() {
    _.each($scope.tabs, $scope.getActiveTab)
  });
};
