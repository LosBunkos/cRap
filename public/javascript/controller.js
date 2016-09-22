app.controller('crapCtrl', function($scope, crapService){

  $scope.texts = crapService.text;
  $scope.loading = false;

  $scope.sendRap = function(){
    $scope.loading = true;
    crapService.sendRap($scope.getText, $scope.loading).then(function(){
      $scope.loading = false;
    });
  }

  


  setTimeout(function(){console.log("yo", $scope.texts)},5000)
})