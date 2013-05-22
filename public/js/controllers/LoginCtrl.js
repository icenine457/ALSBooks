function LoginCtrl($scope, $http, $location) {
  $scope.$emit('changeTab');
  $scope.user = {
    password: "",
    email: ""
  };
  $scope.login = function() {
    $http.post('/api/users/login', $scope.user).
      success(function(data) {
        console.log(data)
        if (data.success) {
          $scope.loginSuccess = true;
        }
      })
  };
}
