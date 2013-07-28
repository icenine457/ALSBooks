function SearchCtrl($scope, $http, $location, $routeParams) {

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
        return isDate;
      },
    }
  };


}
