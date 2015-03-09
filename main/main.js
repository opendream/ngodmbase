'use strict';

angular.module('punjai')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: "static/app/main/main.html",
        controller: 'MainCtrl'
      });
  });