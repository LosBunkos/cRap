var app = angular.module("crapApp", ['ui.router']);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
    url: '/home',
    templateUrl: 'home.html',
    controller: 'crapCtrl'
    })
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