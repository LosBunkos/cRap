app.service('crapService', ['$http', function($http){

  var texts = {
    text: [],

    sendRap(text, loading){
      // console.log("this is the text", text)
      return $http.post('/getRap', {text:text}).success(function(data){
        // console.log(data.sentences)
        angular.copy(data.sentences, texts.text);
        console.log("from the service", texts.text)
        loading = false;
      })
    }
  }

  return texts;

}])