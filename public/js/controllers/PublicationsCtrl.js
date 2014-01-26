function PublicationsCtrl($scope, $http, $location, $cookies, $routeParams, auth) {

  $scope.setIsLoading(true);
  $scope.$emit('changeTab');
  $scope.setOrderBy(!$routeParams.orderBy ? 'pubTitle' : $routeParams.orderBy);
  $scope.orderByTable[$scope.orderBy] = $scope.orderByDir;

  // TODO: Retrieve from API
  $scope.setSearchTerms([
    { field: "pubTitle",             label: "Publication Title", selected: true},
    { field: "member.fullName",      label: "Member Name" },
    { field: "pubYear",              label: "Publication Year" },
    { field: "pubMedium.mediaLabel", label: "Publication Media"}
  ]);


  $scope.list = function() {
    $scope.setIsLoading(true);
    var getUrl = '/api/publications/list/' + $scope.page + '/' + $scope.perPage + '/' + $scope.orderBy + '/' + $scope.orderByDir;

    if ($routeParams.searchBy && $routeParams.q ) {
      $scope.isSearching = true;
      $scope.searchQuery =  $routeParams.q;
      $scope.selectTerm({field: $routeParams.searchBy});
      getUrl = getUrl + '/' + encodeURIComponent($routeParams.searchBy) + '/' + encodeURIComponent($routeParams.q)
    };

    $http.get(getUrl).
      success(function(data) {
        $scope.publications = data.publications;
        $scope.setTotalEntities(data.pubsTotal);

        $scope.pubStatus = function(pub) {
          return pub.verified ? "success" : "warning"
        };

        $scope.publicationsHeader = "There " + ( $scope.totalEntities == 1 ? "is " : "are ") + ($scope.totalEntities > 0 ? $scope.totalEntities : "no") + " publication" + ($scope.totalEntities != 1 ? "s." : ".");
        $scope.setIsLoading(false)

      });

  };

  auth.hasAbility('canEditPublications').then(function(hasAbility) {
    $scope.canEditPubs = hasAbility;
  });
  auth.hasAbility('canEditMembers').then(function(hasAbility) {
    $scope.canEditMembers = hasAbility;
  });

  $scope.$on('logout', function() {
    $scope.canEditPubs = false;
    $scope.canEditMembers = false; 
    $scope.list()
  });

  if (!$scope.publications) {
    $scope.list();
  }
  $scope.setIsLoading(true);

};

function EditPublicationCtrl ($scope, $http, $location, $routeParams) {
  $scope.$emit('changeTab');

  $scope.cancelEdit = function() {
    window.history.back()
  }

  $scope.addPubIdentifier = function() {
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
      })
      .error(function() {
        $location.path("/publications");
      })

    $scope.savePublication = function() {
      $http.post('/api/publications/save/' + $routeParams.memberId + '/' + $routeParams.pubId, $scope.publication).
        success(function(data) {
          window.history.back()
        })
        .error(function() {
          $location.path("/publications");
        })
    }
  }
  else {
    $http.get('/api/publications/new/' + $routeParams.memberId).
      success(function(data) {
        $scope.publication = data.publication;
        $scope.pubMedia = data.pubMedia;
        $scope.isNew = true;
      })
      .error(function() {
        $location.path("/publications");
      })

    $scope.savePublication = function() {
        $http.put('/api/publications/create/' + $routeParams.memberId, $scope.publication).
        success(function(data) {
          window.history.back()
        })
        .error(function() {
          $location.path("/publications");
        })
    }
  }
}

function ViewPublicationCtrl ($scope, $http, $location, $routeParams) {
    $http.get('/api/publications/view/' + $routeParams.memberId + '/' + $routeParams.pubId).
      success(function(data) {
        $scope.publication = data.publication;
        $scope.pubMedia = data.pubMedia;
      })
      .error(function() {
        $location.path("/publications");
      })
}

// }}}
