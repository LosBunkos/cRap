app.controller('crapCtrl', function($scope, crapService){

  $scope.texts = crapService.text;
  $scope.loading = false;
  $scope.getText = '';
  $scope.isError = true;

  $scope.sendRap = function(){
    $scope.isError = false;
    $scope.loading = true;
    crapService.sendRap($scope.getText, $scope.loading).then(function(){
      $scope.texts = crapService.text;
      $scope.loading = false;
      $scope.rapbox = true;
    });
  }

  $scope.collectSentence = function() {
    var sentences = $scope.texts
    console.log(sentences)
  }

  
})