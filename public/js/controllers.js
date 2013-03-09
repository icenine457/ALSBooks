// Controllers
// TODO: Use modules!

// {{{ Index
function IndexCtrl($scope, $http, $location) {
  $scope.getActiveTab = function(navDetails, navPoint) {
    var re = new RegExp("\/" + navDetails.navItem);
    $scope.tabs[navPoint].navClass = $location.path().match(re) !== null ? "active" : false;
  };
  $scope.tabs = {
    member: {
      navItem: "members",
      navClass: ""
    },
    publication: {
      navItem: "publications",
      navClass: ""
    }
  }
  $scope.$on('changeTab', function() {
    _.each($scope.tabs, $scope.getActiveTab)
  });
};

function LandingCtrl($scope, $http, $location) {
  $scope.$emit('changeTab');
}

// }}}

// Members {{{
// TODO: Refactor the hell out of this view/controller. It's huge.
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
  $scope.form = {};
  $http.get('/api/members', $scope.form).
    success(function(data) {
      $scope.members = data;
      $scope.memberHeader = "There " + ( data.length == 1 ? "is " : "are ") + (data.length > 0 ? data.length : "no") + " member" + (data.length != 1 ? "s." : ".");
    });
};


function EditMemberCtrl($scope, $http, $location, $routeParams) {
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
  $scope.google = {
    page: 0,
    limit: 40,
    publications: [],
    isNavigating: false
  };

  $scope.showExisting = function(pubId) {
    $http.get('/api/publications/edit/' + $scope.member._id + '/' + pubId).
      success(function(data) {
        $scope.modalPub = data.publication;
        $scope.pubMedia = data.pubMedia;
        $('#existingPubModal').modal()
      });
  }

  $scope.hidePubModal = function() {
    $('#existingPubModal').modal('hide')
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

  $scope.searchGoogle = function() {
    if ($scope.google.isNavigating) return
    $scope.google.isNavigating = true;
    var url = '/api/members/' + $scope.member._id + '/search/google/' + $scope.google.page + '/' + $scope.google.limit;
    $http.get(url).success(function(data) {
      $scope.importClicked = true;
      $scope.google.publications = $scope.google.publications.concat(data.publications);
      $scope.google.isNavigating = false;
      $scope.google.page = $scope.google.page + $scope.google.limit;
    });
  }

  $scope.google.importPubs = function() {
    var importedPubsToSend = _.where($scope.google.publications, { imported: true } );
    $http.put('/api/publications/import/' + $scope.member._id, importedPubsToSend).
      success(function(data) {
        console.log(data.publications.length);
      });
  };

};

// }}}

// Publications {{{
function PublicationsCtrl($scope, $http, $location) {

  $scope.$emit('changeTab');
  $scope.form = {};
  $http.get('/api/publications', $scope.form).
    success(function(data) {
      $scope.publications = data;
      $scope.publicationsHeader = "There " + ( data.length == 1 ? "is " : "are ") + (data.length > 0 ? data.length : "no") + " publication" + (data.length != 1 ? "s." : ".");
    });
};

function EditPublicationCtrl ($scope, $http, $location, $routeParams) {
  $scope.$emit('changeTab');

  $scope.cancelEdit = function() {
    window.history.back()
  }

  $scope.addPubIdentifier = function() {
    console.log($scope.publication.industryIdentifiers);
    $scope.publication.industryIdentifiers.push({
      type: '',
      identifier: ''
    });
  }


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
          window.history.back()
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
          window.history.back()
        });
    }
  }
}

// }}}
