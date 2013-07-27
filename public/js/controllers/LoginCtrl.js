function LoginCtrl($scope, $http, $location, $cookies, $rootScope, auth) {
  $scope.$emit('changeTab');
  $scope.user = {
    password: "",
    email: ""
  };
  $scope.login = function() {
    auth.login(function(err) {
      if (err) $scope.errors = err;
    }, $scope.user);
  };
}
