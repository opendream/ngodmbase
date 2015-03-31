'use strict';

angular
    .module('odmbase')
    .controller('CommentCtrl', ['$scope', 'Model', 'Comment', CommentCtrl]);

function CommentCtrl ($scope, Model, Comment) {

    $scope.dst = $scope.$parent.model;
    $scope.model = {
        dst: $scope.dst.common_resource_uri
    };


    $scope.commentList = [];
    $scope.commentDataSource = Model.objects.dataSource({
        modelClass: Comment,
        orderBy: '-id',
        params: {dst: $scope.dst.id},
        $scope: $scope,
        itemListProp: 'commentList',
        reverse: true
    });
    $scope.commentDataSource.loadMore();


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
