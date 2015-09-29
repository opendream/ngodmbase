angular.module('odmbase').directive('messageSendButton', function () {

    return {
        restrict: 'A',
        transclude: true,
        template: '<a href="" ng-class="buttonClass" ng-click="modalOpen()"><span ng-transclude></span></a>',
        scope: {
            buttonClass: '@',
            dst: '=',
            defaultTitle: '=?',
            defaultMessage: '=?',
            ignoreTitle: '=?',
        },
        controller: ['$scope', 'Message', '$rootScope', 'Auth', 'Modal', function ($scope, Message, $rootScope, Auth, Modal) {
            $scope.modalOpen = function () {
                if (!Auth.isLoggedIn()) {
                    Modal.open('/static/app/odmbase/account/modal/login_modal.html');
                    return;
                }


                $scope.message = Message.one();
                $scope.message.dst = $scope.dst;
                $scope.message.title = !$scope.ignoreTitle && ($scope.message.title || $scope.defaultTitle);
                $scope.message.message = $scope.message.message || $scope.defaultMessage;

                Modal.open('/static/app/odmbase/message/modal/message_modal.html', null, {message: $scope.message, title: $scope.modalTitle, getCurrentUser: Auth.getCurrentUser});

                //message.save().then(function (model) {
                //    message = model;
                //});

            }
        }]
    }
});