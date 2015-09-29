'use strict';

angular
    .module('odmbase')
    .controller('MessageFormCtrl', ['$scope', '$timeout', MessageFormCtrl]);

function MessageFormCtrl ($scope, $timeout) {

    $scope.message = $scope.param.message;

    $scope.sendMessage = function (form) {
        $scope.submitted = true;
        if(form.$valid) {
            $scope.message.save().then(function (updateModel) {

                $scope.success = true;

                $timeout(function () {$scope.cancel('cancel');}, 2000);
            });
        }
    }

}