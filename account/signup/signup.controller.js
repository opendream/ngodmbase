'use strict';
angular
    .module('odmbase')
    .controller('SignupCtrl', ['$scope', 'Auth', '$location', 'Modal', '$window', '$state', SignupCtrl ]);

function SignupCtrl ($scope, Auth, $location, Modal, $window, $state) {

    $scope.SIGNUP_TEMPLATE = SIGNUP_TEMPLATE;
    $scope.user = {};
    $scope.errors = {};
    if ($scope.param && $scope.param.email) {
        $scope.user.email = $scope.param.email;
    }

    $scope.register = function(form, redirectUrl, successCallback) {

        console.log(redirectUrl);
        console.log($scope.param);

        redirectUrl = ($scope.param && $scope.param.redirectUrl) || redirectUrl;
        successCallback = successCallback || ($scope.param && $scope.param.successCallback);
        var reload = ($scope.param && $scope.param.reload)

        $scope.submitted = true;
        if(form.$valid) {
            Auth.createUser($scope.user, function (err, model) {
                if (err) {
                    if (err.data.error_message) {
                        form['email'].$setValidity('mongoose', false);
                        $scope.errors['email'] = ['อีเมลนี้มีผู้ใช้งานแล้ว'];
                    }
                    else {
                        angular.forEach(err.data.error, function (message, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = message;
                        });
                    }
                    console.log($scope.errors);
                } else {
                    var redirect = true;
                    if ($scope.cancel) {
                        $scope.cancel();
                        redirect =false;
                    }

                    if (successCallback) {
                        successCallback(model);
                    }
                    else {
                        // do callback ex redirect to page
                        redirectUrl = redirectUrl || 'profile';
                        $location.path(redirectUrl);
                        console.log('$state.$current', $state.$current);
                        setTimeout(function () {
                            $state.go($state.$current, null, { reload: true });
                        }, 100);

                    }
                }
            });
        }
    };

    Auth.$scope = $scope;
    Auth.successCallback = $scope.param && $scope.param.successCallback;
    $scope.socialSign = Auth.socialSign;

    $scope.loginClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('login');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/login_modal.html', null, $scope.param);
        }
    };

    $scope.$watch('user.email', function (newValue, oldValue) {

        if (newValue != oldValue && $scope.form.email.$invalid) {
            $scope.form.email.$setValidity('mongoose', true);
            $scope.submitted = false;

        }
    });
    $scope.forgotPasswordClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('forgotPassword');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/forgot_password_modal.html', null, $scope.param);
        }
    };
    /*
    $scope.$watch('user.display_name', function (newValue, oldValue) {
        $scope.submitted = false;
    });
    $scope.$watch('user.password', function (newValue, oldValue) {
        $scope.submitted = false;
    });
    */
}
