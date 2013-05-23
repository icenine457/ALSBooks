
function PublicationsCtrl($scope, $http, $location, $cookies) {

  $scope.$emit('changeTab');
  $scope.form = {};
  $scope.loggedIn = !(typeof($cookies["alsbooks.loggedIn"]) === "undefined");
  $scope.page = 0;
  $scope.perPage = 10;

  $scope.list = function() {
    $http.get('/api/publications/list/' + $scope.page + '/' + $scope.perPage).
      success(function(data) {
        $scope.publications = data.publications;
        $scope.pubsTotal = data.pubsTotal;

        $scope.pubStatus = function(pub) {
          return pub.verified ? "success" : "warning"
        };

        $scope.publicationsHeader = "There " + ( $scope.pubsTotal == 1 ? "is " : "are ") + ($scope.pubsTotal > 0 ? $scope.pubsTotal : "no") + " publication" + ($scope.pubsTotal != 1 ? "s." : ".");

        $scope.visiblePages = function() {
          var allPages = Math.ceil($scope.pubsTotal / $scope.perPage);
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

  };
  $scope.list()

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
