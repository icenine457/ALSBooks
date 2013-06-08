
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

  $scope.list = function() {
    $http.get('/api/publications/list/' + $scope.page + '/' + $scope.perPage + '/' + $scope.orderBy + '/' + $scope.orderByDir).
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

    if ($scope.page < 4) { return [0,1,2,3,4,5,6,7,8,9] };
    var pageMax = parseInt($scope.page) + 6;
    var pageMin = $scope.page - 4;
    for (var pppp = pageMin; pppp < pageMax; pppp++) {
      if (pppp < allPages) visible.push(pppp);
    }
    return visible;
  }

  if (!$scope.publications) {
    $scope.list();
  }

  $scope.doSearch = function() {
    $location.search({page: $scope.page, perPage: $scope.perPage, orderBy: $scope.orderBy, orderByDir: $scope.orderByDir })
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
