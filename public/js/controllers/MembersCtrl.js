function ImportMemberCtrl($scope, $http, $location) {
  $scope.$emit('changeTab');
  $scope.form = {};
  $scope.successCount = 0;
  $scope.error = '';
  $scope.uploadImport = function() {
    var file = document.getElementById("importMembersCsv").files[0];
    var reader = new FileReader();
    reader.onloadend = function(thisFile) {
      $http.post('/api/importMembers', thisFile).
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

function MembersCtrl($scope, $http, $location) {
  $scope.$emit('changeTab');
  $scope.page = 0;
  $scope.perPage = 10;
  $scope.list = function() {
    $http.get('/api/members/list/' + $scope.page + '/' + $scope.perPage).
      success(function(data) {
        $scope.members = data.members;
        $scope.membersTotal = data.membersTotal;
        $scope.memberHeader = "There " + ( $scope.membersTotal == 1 ? "is " : "are ") + ($scope.membersTotal > 0 ? $scope.membersTotal : "no") + " member" + ($scope.membersTotal != 1 ? "s." : ".");
        $scope.visiblePages = function() {
          var allPages = Math.ceil($scope.membersTotal / $scope.perPage);
          var visible = [];

          // I weep for not having a .. method
          if ($scope.page < 4) { return [0,1,2,3,4,5,6,7,8,9] };
          for (var pppp = $scope.page - 4; pppp < $scope.page + 6; pppp++) {
            if (pppp < allPages) visible.push(pppp);
          }
          return visible;
        }
        $scope.isPageSelected = function(page) {
          if (page == $scope.page) {
            return "active"
          }
        };
      });
    }
  $scope.list();

  $scope.navPage = function(page) {
    if ($scope.page == page) return;
    $scope.skip = page * $scope.perPage;
    $scope.page = page;
    $scope.list();
  };
  $scope.nextPage = function() {
    if ($scope.page == Math.ceil($scope.membersTotal / $scope.perPage)) return;
    ++$scope.page
    $scope.skip = $scope.page * $scope.perPage;
    $scope.list();
  };
  $scope.prevPage = function() {
    if ($scope.page == 0) return;
    --$scope.page
    $scope.skip = $scope.page * $scope.perPage;
    $scope.list();
  };
};

function EditMemberCtrl($scope, $http, $location, $routeParams) {
  $scope.$emit('changeTab');
  $http.get('/api/members/edit/' + $routeParams.id).
    success(function(data) {
      console.log(data);
      $scope.member = data.member;
      $scope.tabs = {
        member: 'active',
        publication: ''
      }
    });

  $scope.importClicked = false;
  $scope.isEditing = false;
  $scope.memberBtnText = "Edit";

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
    $http.put('/api/members/save/' + $routeParams.id, $scope.member).
      success(function(data) {
        $location.path('/members');
      });
  };


  $scope.addPublication = function() {
    $location.path('/publications/new/' + $scope.member._id);
  }


};
