function UsersCtrl($scope, $http, $location, userService) {
  $scope.$emit('changeTab');
  $scope.errors = {}
  $scope.tabs = {
    createUser: 'active',
    manageUsers: null,
  }

  $scope.toggleTab = function(activeTab) {
    for (var tab in $scope.tabs) {
      $scope.tabs[tab] = '';
    }
    $scope.tabs[activeTab] = 'active';
  };

  var success = function(data) {
    if (data.errors) {
      $scope.errors = data.errors;
      console.error($scope.errors);
      return;
    }
    if (data.success) {
      $scope.errors = {};
      $location.path("/users");
    }
  }
  $scope.signup = function() {
    userService.signup($scope.user).then(success);
  }
}
