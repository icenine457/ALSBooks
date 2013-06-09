function ListCtrl($scope, $http, $location, $cookies, $routeParams) {

  $scope.form = {};
  $scope.loggedIn = !(typeof($cookies["alsbooks.loggedIn"]) === "undefined");
  $scope.page = ( ( $routeParams.page === undefined || isNaN($routeParams.page)) ? 0 : $routeParams.page )
  $scope.perPage = ( ( $routeParams.perPage === undefined || isNaN($routeParams.perPage)) ? 10 : $routeParams.perPage )
  $scope.orderByDir = ( ( $routeParams.orderByDir === undefined || isNaN($routeParams.orderByDir)) ? 1 : $routeParams.orderByDir )
  $scope.orderByTable = {}

  $scope.updateTerm = function() {
    _.each($scope.searchTerms, function(term) {
    });
  }

  $scope.setTotalEntities = function(count) {
    $scope.totalEntities = count;
  }

  $scope.setOrderBy = function(orderBy) {
    $scope.orderBy = orderBy;
  };

  $scope.searchQuery = '';
  $scope.isSearching = false;


  $scope.setSearchTerms = function(terms) {
    $scope.searchTerms = terms;
  }

  $scope.selectTerm = function(selectedTerm) {
    _.each($scope.searchTerms, function(term) {
      term.selected = (term.label == selectedTerm.label || term.field == selectedTerm.field);
    });
  }

  $scope.currentSearchTerm = function() {
    return _.find($scope.searchTerms, function(term) {
      return term.selected;
    });
  }

  $scope.isPageSelected = function(page) {
    if (page == $scope.page) {
      return "active"
    }
  };

  $scope.navPage = function(page) {
    if ($scope.page == page) return;
    $scope.skip = page * $scope.perPage;
    $scope.page = page;
    $scope.doSearch();
  };

  $scope.nextPage = function() {
    if ($scope.page == Math.ceil($scope.totalEntities / $scope.perPage)) return;
    ++$scope.page
    $scope.skip = $scope.page * $scope.perPage;
    $scope.doSearch();
  }

  $scope.prevPage = function() {
    if ($scope.page == 0) return;
    --$scope.page
    $scope.skip = $scope.page * $scope.perPage;
    $scope.doSearch();
  }

  $scope.search = function(query) {
    $scope.searchQuery = query;
    $scope.isSearching = true;
    $scope.page = 0;
    $scope.perPage = 10;
    $scope.doSearch();
  }

  $scope.sortBy = function(property) {
    if ($scope.orderByTable[property] != null) {
      $scope.orderByTable[property] == 1 ? $scope.orderByTable[property] = -1 : $scope.orderByTable[property] = 1;
    }
    $scope.orderBy = property;
    $scope.orderByDir = $scope.orderByTable[property];
    $scope.doSearch();
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

  $scope.visiblePages = function() {
    var allPages = Math.ceil($scope.totalEntities / $scope.perPage);
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


};
