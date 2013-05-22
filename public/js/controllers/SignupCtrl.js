function SignupCtrl($scope, $http, $location) {
  $scope.user = {
    name: "",
    email: "",
    password: "",
    username: ""
  }
  $scope.signup = function() {
    $http.post('/api/users/create', $scope.user).
      success(function(data) {
        console.log(data)
      })

  }
}
