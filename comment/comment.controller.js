'use strict';

angular
    .module('odmbase')
    .controller('CommentCtrl', ['$scope', 'Comment', CommentCtrl]);

function CommentCtrl ($scope, Comment) {

    $scope.dst = $scope.$parent.model;
    $scope.model = {
        dst: $scope.dst.common_resource_uri
    };

    $scope.commentList = [];
    Comment.one().get({dst: $scope.dst.id}).then(function (resp) {
        $scope.commentList = resp.objects.reverse();
    });

    $scope.submitComment = function (form) {

        if(form.$valid) {

            $scope.model = _.extend(Comment.one(), $scope.model);

            delete $scope.model.src;

            $scope.model.save().then(function (updateModel) {

                $scope.model = {
                    dst: $scope.dst.common_resource_uri
                };
                $scope.commentList.push(updateModel);

                form.$setPristine();
            });

        }

    };
}
