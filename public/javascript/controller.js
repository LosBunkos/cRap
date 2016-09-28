app.controller('crapCtrl', function($scope, crapService){

  $scope.texts = crapService.text;
  $scope.loading = false;

  $scope.sendRap = function(){
    $scope.loading = true;
    crapService.sendRap($scope.getText, $scope.loading).then(function(){
      $scope.texts = crapService.text;
      $scope.loading = false;
      $scope.rapbox = true;
    });
  }

  $scope.collectSentence = function() {
    let sentences = $scope.texts
    console.log(sentences)
  }

  
})