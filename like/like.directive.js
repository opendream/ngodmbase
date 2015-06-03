angular.module('odmbase').directive('likeLink', function () {

    return {
        restrict: 'A',
        transclude: true,
        template: '<a href="" ng-class="likedClass" ng-click="like()"><span ng-transclude></span></a>',
        scope: {
            model: '='
        },
        controller: ['$scope', 'Like', '$rootScope', 'Auth', 'Modal', function ($scope, Like, $rootScope, Auth, Modal) {

            var updateClass = function () {
                $scope.likedClass = $scope.model.is_liked ? 'liked': 'like';
            };
            $scope.$watch('model', function (newValue, oldValue) {
                if (newValue && newValue != oldValue) {
                    updateClass();
                }
            });

            updateClass();

            var reloadModel = function () {

                $scope.model.get().then(function (updateModel) {
                    // $scope.model = updateModel;
                    $scope.model.is_liked = updateModel.is_liked;
                    $scope.model.likes_count = updateModel.likes_count;
                    $scope.model.liked_id = updateModel.liked_id;
                    updateClass();
                });
            };


            $scope.like = function () {

                if (!Auth.isLoggedIn()) {
                    Modal.open('/static/app/odmbase/account/modal/login_modal.html');
                    return;
                }

                var like;
                if ($scope.model.is_liked) {
                    like = Like.one($scope.model.liked_id);
                    $scope.model.is_liked = false;
                    $scope.model.likes_count = Math.max(0, $scope.model.likes_count-1);  // For faster feeling

                    like.remove().then(function (resp) {
                        reloadModel();

                        if ($scope.model.likes_count == 0) {
                            $rootScope.$broadcast('updateMasonry');
                        }
                    });
                }
                else {
                    like = Like.one();
                    like.dst = $scope.model;

                    $scope.model.is_liked = true;
                    $scope.model.likes_count++; // For faster feeling
                    like.save().then(function (model) {
                        like = model;
                        $scope.model.liked_id = like.id;

                        reloadModel();

                        if ($scope.model.likes_count == 1) {
                            $rootScope.$broadcast('updateMasonry');
                        }
                        // console.log(like);
                    });
                }
            }
        }]
    }

});

angular.module('odmbase').directive('likeListModalLink', function () {
    return {
        restrict: 'A',
        transclude: true,
        template: '<span ng-class="linkClass" ng-click="modalOpen()"><span ng-transclude></span></span>',
        scope: {
            model: '='
        },
        controller: function ($scope, Like, Modal) {

            $scope.$watch('model.likes_count', function(newValue, oldValue) {
                $scope.linkClass = $scope.model.likes_count? 'is-link': 'not-link';

            });

            $scope.modalOpen = function () {
                if (!$scope.model.likes_count) {
                    return;
                }
                Modal.open('/static/app/odmbase/like/like.html', 'md', {
                    model: $scope.model
                })
            };
        }
    }
});

