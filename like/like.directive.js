angular.module('odmbase').directive('likeLink', function () {

    return {
        restrict: 'A',
        transclude: true,
        template: '<a href="" ng-class="likedClass" ng-click="like()"><span ng-transclude></span></a>',
        scope: {
            model: '='
        },
        controller: function ($scope, Like) {

            var updateClass = function () {
                $scope.likedClass = $scope.model.is_liked? 'liked': 'like';
            };
            $scope.$watch('model', function (newValue, oldValue) {
                updateClass();
            });

            var reloadModel = function () {

                $scope.model.get().then(function (updateModel) {
                    $scope.model = updateModel;
                    updateClass();
                });
            };


            $scope.like = function () {
                var like = Like.one();
                like.dst = $scope.model;

                if ($scope.model.is_liked) {
                    $scope.model.is_liked = false;
                    $scope.model.likes_count = Math.max(0, $scope.model.likes_count-1);  // For faster feeling

                    like.remove().then(function (resp) {
                        reloadModel();
                    });
                }
                else {
                    $scope.model.is_liked = true;
                    $scope.model.likes_count++; // For faster feeling
                    like.save().then(function (resp) {
                        reloadModel();
                    });
                }
            }
        }
    }

});

angular.module('odmbase').directive('likeListModalLink', function () {
    return {
        restrict: 'A',
        transclude: true,
        template: '<a href="" ng-click="modalOpen()"><span ng-transclude></span></a>',
        scope: {
            model: '='
        },
        controller: function ($scope, Like, Modal) {
            $scope.modalOpen = function () {
                Modal.open('/static/app/odmbase/like/like.html', 'md', {
                    model: $scope.model
                })
            };
        }
    }
});

