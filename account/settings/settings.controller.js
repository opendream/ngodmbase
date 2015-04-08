'use strict';

angular.module('odmbase')
  .controller('ProfilePasswordCtrl', ['$scope', '$timeout', '$location', 'User', function ($scope, $timeout, $location, User) {
    $scope.errors = {};

    $scope.user = User.one();
    $scope.redirectPath = '/me';

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {

        $scope.user.change_password().then(function(model) {
          swal({
              title: "เปลี่ยนรหัสผ่านใหม่แล้ว",
              confirmButtonText: 'คลิกเพื่อไปดูหน้าโปรไฟล์ของคุณ'
          }, function (isConfirm) {
              if (isConfirm) {
                  $timeout(function () {
                      $location.path($scope.redirectPath);
                  }, 1);
              }

          });
        }, function (err) {
          angular.forEach(err.data.error, function(message, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = message;
          });
        });

      }
    };

    $scope.$watch('user.old_password', function () {
        $scope.form.old_password.$setValidity('mongoose', true);
    });

  }]);
