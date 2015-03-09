'use strict';

angular.module('odmbase')
  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      // .state('login', {
      //   url: '/login',
      //   templateUrl: 'static/app/account/login/login.html',
      //   controller: 'LoginCtrl'
      // })
      .state('signup', {
        url: '/signup',
        templateUrl: 'static/app/odmbase/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'static/app/odmbase/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'static/app/odmbase/account/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
//      .state('accountDetail', {
//        url: '/:id',
//        templateUrl: '/static/app/odmbase/account/detail/detail.html',
//        controller: 'AccountDetailCtrl'
//      });
  }]);