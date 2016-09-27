var app = angular.module("crapApp", ['ui.router']);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'rap.html',
      controller: 'crapCtrl'
      })
    .state('rap', {
      url: '/rap',
      templateUrl: 'rap.html',
      controller: 'crapCtrl'      
      })
    .state('about', {
      url: '/about',
      templateUrl: 'about.html',
      controller: 'crapCtrl'
      })
    .state('libraries', {
      url: '/libraries',
      templateUrl: 'libraries.html',
      controller: 'crapCtrl'
      })



  })  