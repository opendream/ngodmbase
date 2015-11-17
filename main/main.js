'use strict';

angular.module('odmbase')
  .config(function ($stateProvider) {
    $stateProvider
      .state('front', {
        url: '',
        templateUrl: "static/app/main/main.html",
        controller: 'MainCtrl'
      })
      .state('main', {
        url: '/',
        templateUrl: "static/app/main/main.html",
        controller: 'MainCtrl'
      })
      .state('pageNotFound', {
        url: '/404',
        templateUrl: "static/app/odmbase/components/error/404.html",
        controller: 'MainCtrl'
      });
  });