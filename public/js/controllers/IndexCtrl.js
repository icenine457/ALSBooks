alsbooks.controller('IndexCtrl', function($scope, $http, $location, $cookies) {


  // WARNING: This is only to be used for view logic.
  // ALL sensitive data must be authenticated with the server
  $scope.checkLogin = function() {
    $scope.loggedIn = !(typeof($cookies["alsbooks.loggedIn"]) === "undefined");
  };

  $scope.checkLogin();


  // Sets the active tab in the UI
  $scope.getActiveTab = function(navDetails, navPoint) {
    var re = new RegExp("\/" + navDetails.navItem);
    $scope.tabs[navPoint].navClass = $location.path().match(re) !== null ? "active" : false;
  };

	var generateTabs = function() {
		return {
			login: {
				navItem: "login",
				navClass: "",
				visible: !$scope.loggedIn,
			},
			member: {
				navItem: "members",
				navClass: "",
				visible: $scope.loggedIn,
			},
			publications: {
				navItem: "publications",
				navClass: "",
				visible: true,
			},
			webSearch: {
				navItem: "webSearch",
				navClass: "",
				visible: $scope.loggedIn,
			},
			signup: {
				navItem: "signup",
				navClass: "",
				visible: $scope.loggedIn,
			}
		}
  }

  $scope.tabs = generateTabs()
  $scope.$on('changeTab', function() {
    _.each($scope.tabs, $scope.getActiveTab)
  });

  $scope.$on('login', function() {
    $scope.loggedIn = true;
		$scope.tabs = generateTabs()
    $location.path('/publications');
  });

});
