app.controller('crapCtrl', function($scope, crapService){

   $scope.sendRap = function(){
    crapService.sendRap($scope.getText)
  }
})