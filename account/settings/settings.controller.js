'use strict';

angular
    .module('odmbase')
    .controller('ProfilePasswordCtrl', ['$scope', '$timeout', '$location', '$state', '$q', 'User', 'Auth', ProfilePasswordCtrl]);



function ProfilePasswordCtrl ($scope, $timeout, $location, $state, $q, User, Auth) {


    $scope.showCurrentPassword = true;
    $scope.user = User.one();

    if ($state.params.uid && $state.params.token) {

        $scope.showCurrentPassword = false;

        var deferred = $q.defer();
        $scope.user.uid = $state.params.uid;
        $scope.user.token = $state.params.token;
        $scope.user.reset_password().then(function (data) {
            Auth.setApiKey(data);

            User.one().me().then(function (model) {
                Auth.setCurrentUser(model);
                //$scope.user = model;
                //$scope.user.uid = $state.params.uid;
                //$scope.user.token = $state.params.token;
                deferred.resolve(data);

            }, function (err) {
                deferred.reject(err);
            });

        }, function (err) {
            swal({
                title: "ลิงก์ตั้งค่ารหัสผ่านไม่ถูกต้อง",
                text: "คุณอาจจะเคยใช้ลิงก์นี้ไปแล้ว กรุณาทำการขอรหัสใหม่",
                confirmButtonText: 'คลิกเพื่อกลับไปยังหน้าแรก',
                type: 'error',
                allowEscapeKey: false
            }, function (isConfirm) {
                if (isConfirm) {
                    $timeout(function () {
                        $location.path('/');
                    }, 1);
                }
                else {
                    return false;
                }

            });
        });
    }


    $scope.errors = {};

    $scope.redirectPath = '/me';

    $scope.changePassword = function(form) {

        console.log($scope.user);
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
        if ($scope.form.old_password.$invalid) {
            $scope.form.old_password.$setValidity('mongoose', true);
        }
    });

}

function ProfileForgotPasswordCtrl ($scope, $state, $q, $location, User, Auth) {


}