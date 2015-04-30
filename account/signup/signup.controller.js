'use strict';
angular
    .module('odmbase')
    .controller('SignupCtrl', ['$scope', 'Auth', '$location', 'Modal', '$window', SignupCtrl ]);

function SignupCtrl ($scope, Auth, $location, Modal, $window) {

    $scope.SIGNUP_TEMPLATE = SIGNUP_TEMPLATE;
    $scope.user = {};
    $scope.errors = {};
    if ($scope.param && $scope.param.email) {
        $scope.user.email = $scope.param.email;
    }

    $scope.register = function(form, redirectUrl, successCallback) {

        redirectUrl = redirectUrl || ($scope.param && $scope.param.redirectUrl);
        successCallback = successCallback || ($scope.param && $scope.param.successCallback);

        $scope.submitted = true;
        if(form.$valid) {
            Auth.createUser($scope.user, function (err, model) {
                if (err) {
                    angular.forEach(err.data.error, function(message, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = message;
                    });
                } else {
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
                        redirectUrl = redirectUrl || 'profile';
                        $location.path(redirectUrl);
                    }
                }
            });
        }
    }

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

    $scope.loginClick = function () {
        if($scope.$parent.openUserForm) {
            $scope.$parent.openUserForm('login');
        }
        else {
            Modal.open('/static/app/odmbase/account/modal/login_modal.html', 'LoginCtrl');
        }
    };

    $scope.$watch('user.email', function (newValue, oldValue) {
        if (newValue != oldValue && $scope.form.email.$invalid) {
            $scope.form.email.$setValidity('mongoose', true);
            $scope.submitted = false;

        }
    });

}
