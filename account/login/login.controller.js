'use strict';

angular.module('odmbase')
  .controller('LoginCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {

    $scope.user = {};
    $scope.errors = {};
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $scope.cancel();
        })
        .catch( function(err) {
          $scope.errors.other = err.error;
        });
      }
    };

    $scope.socialSign = function(provider) {
      $scope.cancel(); // Close modal first for faster feeling
      Auth.socialSign(provider);
    };


  }]);
