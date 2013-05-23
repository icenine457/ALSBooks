function LoginCtrl($scope, $http, $location, $cookies) {
  $scope.$emit('changeTab');
  $scope.user = {
    password: "",
    email: ""
  };
  $scope.login = function() {
    $http.post('/api/users/login', $scope.user).
      success(function(loggedIn) {
        if (loggedIn) {
          $scope.$emit('login');
        }
      })
  };
}
