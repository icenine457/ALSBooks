// Controllers
// TODO: Use modules!

function IndexCtrl($scope, $http) {
  $http.get('/api/publications').
    success(function(data, status, headers, config) {
      $scope.publications = data.publications;
    });
};

// Members {{{
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


function EditMemberCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/members/edit/' + $routeParams.id).
    success(function(data) {
      $scope.member = data.member;
    });

  $scope.editMember = function() {
    $http.put('/api/members/save/' + $routeParams.id, $scope.member).
      success(function(data) {
        $location.path('/members');
      });
  };

  $scope.addPublication = function() {
    $location.path('/publications/new/' + $scope.member._id);
  }
};
// }}}

// Publications {{{
function PublicationsCtrl($scope, $http, $location) {
  $scope.form = {};
  $http.get('/api/publications', $scope.form).
    success(function(data) {
      $scope.publications = data;
      $scope.publicationsHeader = "There " + ( data.length == 1 ? "is " : "are ") + (data.length > 0 ? data.length : "no") + " publication" + (data.length != 1 ? "s." : ".");
    });
};

function EditPublicationCtrl ($scope, $http, $location, $routeParams) {
  $scope.isNew = $routeParams.pubId === undefined;
  if (!$scope.isNew) {
    $http.get('/api/publications/edit/' + $routeParams.memberId + '/' + $routeParams.pubId).
      success(function(data) {
        $scope.publication = data.publication;
        $scope.pubMedia = data.pubMedia;
      });

    $scope.savePublication = function() {
      $http.post('/api/publications/save/' + $routeParams.memberId + '/' + $routeParams.pubId, $scope.publication).
        success(function(data) {
          $location.path('/viewMembers');
        });
    }
  }
  else {
    $http.get('/api/publications/new/' + $routeParams.memberId).
      success(function(data) {
        $scope.publication = data.publication;
        $scope.pubMedia = data.pubMedia;
        $scope.isNew = true;
      });

    $scope.savePublication = function() {
        $http.put('/api/publications/create/' + $routeParams.memberId, $scope.publication).
        success(function(data) {
          $location.path('/viewMembers');
        });
    }
  }
}

// }}}
