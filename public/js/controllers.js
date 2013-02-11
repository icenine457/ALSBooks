/* Controllers */

function IndexCtrl($scope, $http) {
  $http.get('/api/publications').
    success(function(data, status, headers, config) {
      $scope.publications = data.publications;
    });
};

function ImportMemberCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.importMember = function() {
    $http.post('/api/importMembers', $scope.form).
      success(function(data) {
        $location.path('/')
      });
  };
};

function MembersCtrl($scope, $http, $location) {
  $scope.form = {};
  $http.get('/api/members', $scope.form).
    success(function(data) {
      $scope.members = data;
    });
};
