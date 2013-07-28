function UsersCtrl($scope, $http, $location) {
  $scope.$emit('changeTab');
  $scope.errors = {}
  $scope.signup = function() {
    $http.post('/api/users/create', $scope.user).
      success(function(data) {
        if (data.errors) {
          $scope.errors = data.errors;
          console.error($scope.errors);
          return;
        }
        if (data.success) {
          $scope.errors = {};
          $location.path("/signup");
        }
      })

  }
}
