'use strict';

angular
    .module('odmbase')
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', 'Modal', '$window', LoginCtrl]);

function LoginCtrl ($scope, Auth, $location, Modal, $window) {

    $scope.LOGIN_TEMPLATE = LOGIN_TEMPLATE;
    $scope.user = {};
    $scope.errors = {};

    if ($scope.param && $scope.param.email) {
        $scope.user.email = $scope.param.email;
    }

    $scope.login = function(form, cb, redirectUrl, successCallback) {

        redirectUrl = redirectUrl || ($scope.param && $scope.param.redirectUrl);
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
                        $window.location.reload();
                    }
                    cb();

                }
            })
            .catch( function(err) {
                $scope.errors.other = err.error;
            });
        }
    };

    $scope.socialSign = function(provider, redirectUrl, confirmRequired) {

        // Close modal first for faster feeling
        var redirect = true;
        if ($scope.cancel) {
            $scope.cancel();
            redirect =false;
        }

        // do callback ex redirect to page
        redirectUrl = redirectUrl || 'profile';
        var cb = function (err, model) {
            if (model.is_new && confirmRequired) {
                if (redirectUrl) {
                    $location.path('/profile/social-confirm').search({next: redirectUrl});
                }
                else {
                    $location.path('/profile/social-confirm');
                }
            }
            else {
                $window.location.reload();
            }
        }

        Auth.socialSign(provider, cb);
    };

    $scope.signupClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('signup');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/signup_modal.html', 'SignupCtrl');
        }
    };
    $scope.forgotPasswordClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('forgotPassword');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/forgot_password_modal.html', 'ForgotPasswordCtrl');
        }
    };
}