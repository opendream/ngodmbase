'use strict';
angular
    .module('odmbase')
    .controller('SignupCtrl', ['$scope', 'Auth', '$location', 'Modal', '$window', SignupCtrl ]);

function SignupCtrl ($scope, Auth, $location, Modal, $window) {

    $scope.SIGNUP_TEMPLATE = SIGNUP_TEMPLATE;

    $scope.user = {};
    $scope.errors = {};
    $scope.$watch('user', function (newValue, oldVale) {

    });
    $scope.register = function(form, redirectUrl) {
        $scope.submitted = true;
        if(form.$valid) {
            Auth.createUser({
                email: $scope.user.email,
                password: $scope.user.password
            }, function (err, model) {
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

                    // do callback ex redirect to page
                    redirectUrl = redirectUrl || 'profile';
                    $location.path(redirectUrl);
                }
            });
        }
    }

    $scope.socialSign = function(provider, redirectUrl) {

        // Close modal first for faster feeling
        var redirect = true;
        if ($scope.cancel) {
            $scope.cancel();
            redirect =false;
        }

        // do callback ex redirect to page
        redirectUrl = redirectUrl || 'profile';
        var cb = function () {
            //if (redirect) {
                $location.path(redirectUrl);
            //}
            //$window.location.reload();
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


}