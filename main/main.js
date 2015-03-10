'use strict';

angular.module('odmbase')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: "static/app/main/main.html",
        controller: 'MainCtrl'
      });
  });