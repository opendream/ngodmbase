'use strict';
angular.module('odmbase')
  .controller('SignupCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {

    $scope.user = {};
    $scope.errors = {};
    $scope.register = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.createUser({
          email: $scope.user.email,
          password: $scope.user.password
        }, function (err, model) {
          if (err) {
            angular.forEach(err.data.error, function(message, field) {
              form[field].$setValidity('mongoose', false);
              console.log(message);
              $scope.errors[field] = message;
            });
          } else {
            $scope.cancel();
            $location.path('/profile');
          }
        });
      }
    }

    $scope.socialSign = function(provider, cb) {

      // Close modal first for faster feeling
      if ($scope.cancel) {
          $scope.cancel();
      }
      // do callback ex redirect to page
      cb = cb || function () {
          $location.path('/');
      }

      Auth.socialSign(provider, cb);
    };


  }]);
