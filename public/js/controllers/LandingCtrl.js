function LandingCtrl($scope, $http, $location, articleService, auth) {
  $scope.$emit('changeTab');

  auth.hasAbility('canManageArticles').then(function(hasAbility) {
    $scope.canManageArticles = hasAbility;
  });

  articleService.list().then(function(articleViewModel) {
    $scope.articles = articleViewModel.articles;
  });
}
