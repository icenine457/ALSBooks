function SearchCtrl($scope, $http, $location, $routeParams) {
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
