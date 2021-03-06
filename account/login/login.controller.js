'use strict';

angular
    .module('odmbase')
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', 'Modal', '$window', '$state', LoginCtrl]);

function LoginCtrl ($scope, Auth, $location, Modal, $window, $state) {

    $scope.LOGIN_TEMPLATE = LOGIN_TEMPLATE;
    $scope.user = {};
    $scope.errors = {};

    if ($scope.param && $scope.param.email) {
        $scope.user.email = $scope.param.email;
    }

    $scope.login = function(form, cb, redirectUrl, successCallback) {

        redirectUrl = ($scope.param && $scope.param.redirectUrl) || redirectUrl;
        successCallback = successCallback || ($scope.param && $scope.param.successCallback);

        $scope.submitted = true;

        if(form.$valid) {
            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            })
            .then( function() {
                // Logged in, redirect to home
                var redirect = true;
                if ($scope.cancel) {
                    $scope.cancel();
                    redirect =false;
                }

                if (successCallback) {
                    successCallback();
                }
                else {
                                    // do callback ex redirect to page
                    cb = cb || function () {
                        if (redirect) {
                            $location.path(redirectUrl || '/');
                        }
                        //$window.location.reload();
                        $state.go($state.$current, null, { reload: true });

                    }
                    cb();

                }
            })
            .catch( function(err) {
                $scope.errors.other = err.error;
            });
        }
    };

    Auth.$scope = $scope;
    $scope.socialSign = Auth.socialSign;

    $scope.$watch(function () { return  Auth.loading;}, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
        $scope.loading = Auth.loading;
    }
});

    $scope.signupClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('signup');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/signup_modal.html', null, $scope.param);
        }
    };
    $scope.forgotPasswordClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('forgotPassword');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/forgot_password_modal.html', null, $scope.param);
        }
    };
}