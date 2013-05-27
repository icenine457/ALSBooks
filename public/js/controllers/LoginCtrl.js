function LoginCtrl($scope, $http, $location, $cookies, $rootScope) {
  $scope.$emit('changeTab');
  $scope.user = {
    password: "",
    email: ""
  };
  $scope.login = function() {
    $http.post('/api/users/login', $scope.user).
      success(function(res) {
        if (res.errors) {
          $scope.errors = res.errors;
          return;
        }
        if (res.success) {
          $rootScope.$broadcast('login');
        }
      })
  };
}
