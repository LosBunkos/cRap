var app = angular.module("crapApp", ['ui.router']);


app.config(function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/offer');

  $stateProvider
  .state('rap', {
    url: '/rap',
    templateUrl: 'rap.html'
    })
  .state('about', {
    url: '/about',
    templateUrl: 'about.html',
    controller: 'crapCtrl'
    })
  .state('libraries', {
    url: '/get',
    templateUrl: 'libraries.html',
    controller: 'crapCtrl'
    })



  })  