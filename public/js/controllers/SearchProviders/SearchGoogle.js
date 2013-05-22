function SearchGoogleCtrl($scope, $http, $location, $routeParams) {
  $scope.$emit('changeTab');
  $scope.page = 0
  $scope.limit = 40
  $scope.isLoading = true;
  $scope.publications = []
  $scope.memberId = $routeParams.memberId;
  $scope.disableShowMore = true;

  $scope.searchGoogle = function() {
    var url = '/api/search/google/' + $scope.memberId + '/' + $scope.page + '/'
    + $scope.limit;
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
    $http.put('/api/publications/import/' + $scope.memberId,
    importedPubsToSend).
      success(function(data) {
        $scope.publications = _.where($scope.publications, { imported: false }
        );
        $scope.isLoading = false;
      });
  };

}

