function IndexCtrl($scope, $http, $location) {
  $scope.getActiveTab = function(navDetails, navPoint) {
    var re = new RegExp("\/" + navDetails.navItem);
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
    publication: {
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
