
function PublicationsCtrl($scope, $http, $location, $cookies, $routeParams) {

  $scope.$emit('changeTab');
  $scope.form = {};
  $scope.loggedIn = !(typeof($cookies["alsbooks.loggedIn"]) === "undefined");

  $scope.page = ( ( $routeParams.page === undefined || isNaN($routeParams.page)) ? 0 : $routeParams.page )
  $scope.perPage = ( ( $routeParams.perPage === undefined || isNaN($routeParams.perPage)) ? 10 : $routeParams.perPage )

  $scope.orderBy = !$routeParams.orderBy ? 'pubTitle' : $routeParams.orderBy;
  $scope.orderByDir = ( ( $routeParams.orderByDir === undefined || isNaN($routeParams.orderByDir)) ? 1 : $routeParams.orderByDir )
  $scope.orderByTable = {}

  $scope.orderByTable[$scope.orderBy] = $scope.orderByDir;

  // TODO: Retrieve from API
  $scope.searchTerms = [
    { field: "pubTitle",             label: "Publication Title", selected: true},
    { field: "member.fullName",      label: "Member Name" },
    { field: "pubYear",              label: "Publication Year" },
    { field: "pubMedium.mediaLabel", label: "Publication Media"}
  ]

  $scope.updateTerm = function() {
    _.each($scope.searchTerms, function(term) {
    });
  }

  $scope.selectTerm = function(selectedTerm) {
    _.each($scope.searchTerms, function(term) {
      term.selected = (term.label == selectedTerm.label || term.field == selectedTerm.field);
    });
  }

  $scope.searchQuery = '';
  $scope.isSearching = false;

  $scope.search = function() {
    $scope.isSearching = true;
    $scope.page = 0;
    $scope.perPage = 10;
    $scope.doSearch();
  }

  $scope.currentSearchTerm = function() {
    return _.find($scope.searchTerms, function(term) {
      return term.selected;
    });
  }

  $scope.doSearch = function() {
    var query = {
      page: $scope.page,
      perPage: $scope.perPage,
      orderBy: $scope.orderBy,
      orderByDir: $scope.orderByDir,
    };
    if ($scope.isSearching && $scope.searchQuery != '') {
      query.searchBy = encodeURIComponent($scope.currentSearchTerm().field);
      query.q = encodeURIComponent($scope.searchQuery);
    }
    $location.search(query)
  }

  $scope.list = function() {
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
        $scope.pubsTotal = data.pubsTotal;

        $scope.pubStatus = function(pub) {
          return pub.verified ? "success" : "warning"
        };

        $scope.publicationsHeader = "There " + ( $scope.pubsTotal == 1 ? "is " : "are ") + ($scope.pubsTotal > 0 ? $scope.pubsTotal : "no") + " publication" + ($scope.pubsTotal != 1 ? "s." : ".");

      });

  };

  $scope.isPageSelected = function(page) {
    if (page == $scope.page) {
      return "active"
    }
  };
  $scope.visiblePages = function() {
    var allPages = Math.ceil($scope.pubsTotal / $scope.perPage);
    var visible = [];

    if (allPages == 10) { return [0,1,2,3,4,5,6,7,8,9] };
    if (allPages < 10) {
      for (var pppp = 0; pppp < allPages; pppp++) {
        visible.push(pppp);
      }
      return visible;
    };

    var pageMax = ( $scope.page < 6 ? 10 : $scope.page + 5);
    var pageMin = ( $scope.page > 4 ? $scope.page - 4 : 0);
    for (var pppp = pageMin; pppp < pageMax; pppp++) {
      if (pppp < allPages) visible.push(pppp);
    }
    return visible;
  }

  if (!$scope.publications) {
    $scope.list();
  }


  $scope.navPage = function(page) {
    if ($scope.page == page) return;
    $scope.skip = page * $scope.perPage;
    $scope.page = page;
    $scope.doSearch();
  };
  $scope.nextPage = function() {
    if ($scope.page == Math.ceil($scope.pubsTotal / $scope.perPage)) return;
    ++$scope.page
    $scope.skip = $scope.page * $scope.perPage;
    $scope.doSearch();
  };
  $scope.prevPage = function() {
    if ($scope.page == 0) return;
    --$scope.page
    $scope.skip = $scope.page * $scope.perPage;
    $scope.doSearch();
  };

  $scope.sortBy = function(property) {
    if ($scope.orderByTable[property] != null) {
      $scope.orderByTable[property] == 1 ? $scope.orderByTable[property] = -1 : $scope.orderByTable[property] = 1;
    }
    $scope.orderBy = property;
    $scope.orderByDir = $scope.orderByTable[property];
    $scope.doSearch();
  };
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

function ViewPublicationCtrl ($scope, $http, $location, $routeParams) {
    $http.get('/api/publications/view/' + $routeParams.memberId + '/' + $routeParams.pubId).
      success(function(data) {
        $scope.publication = data.publication;
        $scope.pubMedia = data.pubMedia;
      });
}

// }}}
