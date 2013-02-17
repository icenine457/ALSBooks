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
      $scope.memberHeader = "There " + ( data.length == 1 ? "is " : "are ") + (data.length > 0 ? data.length : "no") + " member" + (data.length != 1 ? "s." : ".");
    });
};

function PublicationsCtrl($scope, $http, $location) {
  $scope.form = {};
  $http.get('/api/publications', $scope.form).
    success(function(data) {
      $scope.publications = data;
      $scope.publicationsHeader = "There " + ( data.length == 1 ? "is " : "are ") + (data.length > 0 ? data.length : "no") + " publication" + (data.length != 1 ? "s." : ".");
    });
};

function EditPublicationCtrl ($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/editPublication/' + $routeParams.memberId + "/" + $routeParams.pubId).
    success(function(data) {
      $scope.publication = data.publication;
      $scope.pubMedia = data.pubMedia;
    });

  $scope.savePublication = function() {
    $http.put('/api/editPublication/' + $routeParams.memberId + '/' + $routeParams.pubId, $scope.publication).
      success(function(data) {
        $location.path('/viewMembers');
      });
  }

  $scope.cancelPublication = function() {
    $http.get('/api/editMember/' + $routeParams.id).
      success(function(data) {
        $scope.member = data.member;
        $scope.pubMedia = data.pubMedia;
        $scope.isEditingPub = false;
      });
  }
}

function EditMemberCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/editMember/' + $routeParams.id).
    success(function(data) {
      $scope.member = data.member;
      $scope.pubMedia = data.pubMedia;
    });

  $scope.editMember = function() {
    $http.put('/api/editMember/' + $routeParams.id, $scope.member).
      success(function(data) {
        $location.path('/viewMembers');
      });
  };

  $scope.addPublication = function() {
    $location.path('/editPublication/' + $scope.member._id + '/0');
  }
};
