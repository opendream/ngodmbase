'use strict';

angular
    .module('odmbase')
    .controller('ForgotPasswordCtrl', ['$scope', 'Auth', '$location', 'Modal', '$window', 'User', ForgotPasswordCtrl]);

function ForgotPasswordCtrl ($scope, Auth, $location, Modal, $window, User) {

    $scope.FORGOT_PASSWORD_TEMPLATE = FORGOT_PASSWORD_TEMPLATE;

    $scope.user = User.one();
    $scope.errors = {};
    $scope.forgotPassword = function(form, cb) {
        $scope.submitted = true;

        if(form.$valid) {
            $scope.user.forgot_password().then(function (model) {
                // TODO
            }, function (err) {
                $scope.errors.other = err.error
            });
        }
    };

    $scope.signupClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('signup');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/signup_modal.html', null, $scope.param);
        }
    };
    $scope.loginClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('login');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/login_modal.html', null, $scope.param);
        }
    };
}