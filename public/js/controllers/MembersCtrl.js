function MembersCtrl($scope, $http, $location, $cookies, $routeParams) {

  $scope.$emit('changeTab');
  $scope.setOrderBy(!$routeParams.orderBy ? 'fullName' : $routeParams.orderBy);
  $scope.orderByTable[$scope.orderBy] = $scope.orderByDir;

  // TODO: Retrieve from API
  $scope.setSearchTerms([
    { field: "fullName", label: "Member Name", selected: true},
    { field: "emailAddresses",    label: "E-mail Address" }
  ]);


  $scope.list = function() {
    var getUrl = '/api/members/list/' + $scope.page + '/' + $scope.perPage + '/' + $scope.orderBy + '/' + $scope.orderByDir;
    if ($routeParams.searchBy && $routeParams.q ) {
      $scope.isSearching = true;
      $scope.searchQuery =  $routeParams.q;
      $scope.selectTerm({field: $routeParams.searchBy});
      getUrl = getUrl + '/' + encodeURIComponent($routeParams.searchBy) + '/' + encodeURIComponent($routeParams.q)
    };

    $http.get(getUrl).
      success(function(data) {
        $scope.members = data.members;
        $scope.setTotalEntities(data.membersTotal);

        $scope.memberHeader = "There " + ( $scope.totalEntities == 1 ? "is " : "are ") + ($scope.totalEntities > 0 ? $scope.totalEntities : "no") + " member" + ($scope.totalEntities != 1 ? "s." : ".");

      });

  };

  if (!$scope.members) {
    $scope.list();
  }

};

function EditMemberCtrl($scope, $http, $location, $routeParams, auth) {
  $scope.$emit('changeTab');
  $http.get('/api/members/edit/' + $routeParams.id).
    success(function(data) {
      $scope.member = data.member;
      $scope.tabs = {
        member: 'active',
        publication: ''
      }
    });

  $scope.importClicked = false;
  $scope.isEditing = false;
  $scope.memberBtnText = "Edit";
  $scope.canArchiveMemberPubs = false;

  auth.hasAbility('canArchiveMemberPublications').then(function(hasAbility) {
    $scope.canArchiveMemberPubs = hasAbility;
  });

  $scope.pubStatus = function(pub) {
    return pub.verified ? "success" : "warning"
  };

  $scope.toggleTab = function(activeTab) {
    for (var tab in $scope.tabs) {
      $scope.tabs[tab] = '';
    }
    $scope.tabs[activeTab] = 'active';
  };

  $scope.toggleEdit = function() {
    if ($scope.isEditing) {
      $scope.isEditing = false;
    }
    else {
      $scope.isEditing = true;
    }

  };
  $scope.editMember = function() {
    $http.put('/api/members/save/' + $routeParams.id, $scope.member)
      .success(function(data) {
        $location.path('/members');
      });
  };

  // TODO: Some form of notification would be nice
  // Convert to service, use toastr
  $scope.archive = function() {
    $http.delete('/api/archive/publications/' + $scope.member._id)
      .success(function(data) {
      })
      .error(function(err) {
      });

  };


  $scope.addPublication = function() {
    $location.path('/publications/new/' + $scope.member._id);
  }


};

function ImportMemberCtrl($scope, $http, $location) {
  $scope.$emit('changeTab');
  $scope.form = {};
  $scope.successCount = 0;
  $scope.error = '';
  $scope.uploadImport = function() {
    var file = document.getElementById("importMembersCsv").files[0];
    var reader = new FileReader();
    reader.onloadend = function(thisFile) {
      $http.post('/api/members/import', thisFile).
        success(function(data) {
          $location.path('/members');
        }).
        error(function(data) {
          $scope.error = data.error;
        });
    };
    reader.readAsText(file)
  };
};
