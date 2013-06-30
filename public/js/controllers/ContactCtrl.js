function ContactCtrl($scope, $http, $location, $cookies, $routeParams) {
  $scope.$emit('changeTab');
  $scope.subjects = [
    "Opt-out of listing",
    "Positive feedback",
    "Enhancement",
    "Bug Report",
    "Other"
  ];

  $scope.send = function() {
    var mail = {
      email: $scope.email || '',
      name: $scope.name || '',
      subject: $scope.subject || '',
      text: $scope.messageText || '',
    }
    var url = "/api/contact"
    $http.post(url, mail)
      .success(function(data) {
        window.history.back()
      })
      .error(function(err) {
        $scope.errors = err.errors;
      });
  };
};
