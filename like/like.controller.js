'use strict';

angular
    .module('odmbase')
    .controller('LikeCtrl', ['$scope', 'Model', 'Like', LikeCtrl]);

function LikeCtrl ($scope, Model, Like) {
    if ($scope.param && $scope.param.model) {
        $scope.dst = $scope.param.model;
    }
    else {
        $scope.dst = $scope.$parent.model;
    }

    $scope.likeList = [];
    $scope.likeDataSource = new Model.objects.dataSource({
        modelClass: Like,
        orderBy: '-id',
        params: {dst: $scope.dst.id},
        $scope: $scope,
        itemListProp: 'likeList'
    });
    $scope.likeDataSource.loadMore();
}
