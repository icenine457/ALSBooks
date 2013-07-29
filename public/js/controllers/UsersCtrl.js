function UsersCtrl($scope, $http, $location, userService, auth) {

  auth.hasAbility("canManageUsers").then(function(hasAbility) {
    if (!hasAbility) {
      $location.path('/publications');
    }
  });
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
  }

  userService.getUsers().then(function(data) {
    $scope.users = data.users;
    $scope.abilities = data.abilities;
  });

  $scope.setUser = function(user) {
    $scope.userSelected = true
    $scope.selectedUser = user
  };
  $scope.cancelEdit = function() {
    $scope.userSelected = false
    $scope.selectedUser = null
  }

  $scope.updateUser = function() {
    userService.update($scope.selectedUser).then(function(data) {
      $scope.cancelEdit();
    });
  };

  var success = function(data) {
    if (data.errors) {
      $scope.errors = data.errors;
      return;
    }
    if (data.success) {
      $scope.errors = {};
      $location.path("/users");
    }
  }

  $scope.userSelected = false;

  $scope.signup = function() {
    userService.signup($scope.user).then(success);
  }
}
