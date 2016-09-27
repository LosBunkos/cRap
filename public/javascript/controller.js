app.controller('crapCtrl', function($scope, crapService){

  $scope.texts = crapService.text;
  $scope.loading = false;

  $scope.sendRap = function(){
    console.log("gettext yo", $scope.getText)
    $scope.loading = true;
    crapService.sendRap($scope.getText, $scope.loading).then(function(){
      $scope.texts = crapService.text;
      $scope.loading = false;
      $scope.rapbox = true;
    });
  }

  


  setTimeout(function(){console.log("yo", $scope.texts)},5000)
})