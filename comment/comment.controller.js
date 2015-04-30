'use strict';

angular
    .module('odmbase')
    .controller('CommentCtrl', ['$scope', 'Model', 'Comment', '$rootScope', CommentCtrl]);

function CommentCtrl ($scope, Model, Comment, $rootScope) {

    if ($scope.param && $scope.param.model) {
        $scope.dst = $scope.param.model;
    }
    else {
        $scope.dst = $scope.$parent.model;
    }

    $scope.model = {
        dst: $scope.dst.common_resource_uri
    };

    $scope.commentList = [];
    $scope.commentDataSource = new Model.objects.dataSource({
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

                // Update from client first because is faster feeling
                $scope.dst.comments_count = $scope.dst.comments_count || 0;
                $scope.dst.comments_count++;

                // Make sure server side return and update later
                $scope.dst.comments_count = updateModel.get_dst.comments_count;

                if ($scope.dst.comments_count == 1) {
                    $rootScope.$broadcast('updateMasonry');
                }

                form.$setPristine();
            });

        }

    };
}
