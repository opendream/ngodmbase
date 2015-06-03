'use strict';

angular.module('odmbase')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider

      .state('search', {
        url: '/search',
        templateUrl: '/static/app/search/all.html',
        controller: 'SearchCtrl'
      });


  }]);
