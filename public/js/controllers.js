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
    },
    webSearch: {
      navItem: "webSearch",
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

function SearchCtrl($scope, $http, $location, $routeParams) {
  $scope.$emit('changeTab');
  $http.get('/api/members', $scope.form).
    success(function(data) {
      $scope.members = data;
    });

  $scope.getDate = function(dateStr) {
    return new Date(dateStr);
  }

  $scope.searchProviders = {
    google: {
      search: function(member) {
        $location.path('/webSearch/google/' + member._id);
      },
      hasBeenSearched: function(member) {
        // TODO: Investigate moment.js for this
        var lastSearched = member.googleSearched;
        var isDate = (typeof(lastSearched) === "string" )
        //if (member.lastName == 'Ludlum') console.log(typeof(lastSearched));
        return isDate;
      },
    }
  };


}

function SearchGoogleCtrl($scope, $http, $location, $routeParams) {
  $scope.$emit('changeTab');
  $scope.page = 0
  $scope.limit = 40
  $scope.isLoading = true;
  $scope.publications = []
  $scope.memberId = $routeParams.memberId;
  $scope.disableShowMore = true;

  $scope.searchGoogle = function() {
    var url = '/api/search/google/' + $scope.memberId + '/' + $scope.page + '/' + $scope.limit;
    $http.get(url).success(function(data) {
      $scope.member = data.member;
      if (data.publications && !data.publications.length == 0) {
        $scope.disableShowMore = false;
        $scope.publications = $scope.publications.concat(data.publications);
      }
      else {
        $scope.disableShowMore = true;
      }
      $scope.page = $scope.page + $scope.limit;
      $scope.isLoading = false;
    })
  }

  $scope.searchGoogle();

  $scope.disableButtons = function() {
    if ($scope.isLoading) return "disabled";
  };


  $scope.showExisting = function(pubId) {
    $http.get('/api/publications/edit/' + $scope.memberId + '/' + pubId).
      success(function(data) {
        $scope.modalPub = data.publication;
        $scope.pubMedia = data.pubMedia;
        $('#existingPubModal').modal()
      });
  }

  $scope.hidePubModal = function() {
    $('#existingPubModal').modal('hide')
  };

  $scope.importPubs = function(isVerified) {
    $scope.isLoading = true;
    var importedPubsToSend = _.where($scope.publications, { imported: true } );
    if (isVerified) {
      importedPubsToSend = _.map(importedPubsToSend, function(pub) {
        pub.verified = true;
        return pub;
      });
    }
    $http.put('/api/publications/import/' + $scope.memberId, importedPubsToSend).
      success(function(data) {
        $scope.publications = _.where($scope.publications, { imported: false } );
        $scope.isLoading = false;
      });
  };

}

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

// }}}

// Publications {{{
function PublicationsCtrl($scope, $http, $location) {

  $scope.$emit('changeTab');
  $scope.form = {};
  $http.get('/api/publications', $scope.form).
    success(function(data) {
      $scope.publications = data;

      $scope.pubStatus = function(pub) {
        return pub.verified ? "success" : "warning"
      };

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
    // TODO: Move to controller
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
