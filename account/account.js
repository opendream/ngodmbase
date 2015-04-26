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
      .state('profilePassword', {
        url: '/profile/password',
        templateUrl: 'static/app/odmbase/account/settings/password.html',
        controller: 'ProfilePasswordCtrl',
        authenticate: true
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'static/app/account/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .state('me', {
        url: '/me',
        templateUrl: '/static/app/account/detail/detail.html',
        controller: 'AccountDetailCtrl'
      })
      .state('invite', {
        url: '/invite',
        templateUrl: '/static/app/odmbase/account/invite/invite.html',
        controller: 'InviteCtrl'
      })
      .state('inviteConfirm', {
        url: '/invite/:code',
        templateUrl: '/static/app/main/main.html',
        controller: 'InviteConfirmCtrl'
      })
      .state('accountDetail', {
        url: '/:username',
        templateUrl: '/static/app/account/detail/detail.html',
        controller: 'AccountDetailCtrl'
      });


  }]);
