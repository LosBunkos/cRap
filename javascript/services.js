app.service('crapService', ['$http', function($http){

  var texts = {
    text: [],

    sendRap(text){
      console.log("this is the text", text)
      $http.post('https://3c4a602e.ngrok.io/getRap', {text:text}).success(function(data){
        console.log(data)
      })
    }
  }

  return texts;

}])