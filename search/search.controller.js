'use strict';

angular
    .module('odmbase')
    .controller('SearchCtrl', ['$scope', '$location', 'Model', 'Search', 'User', 'Auth', SearchCtrl])
    .controller('SearchBoxCtrl', ['$scope', '$location', 'Model', 'Search', 'User', '$timeout', SearchBoxCtrl]);


function searchHelper ($scope, $location, Model, Search, User, content_type, clearBeforeLoad, caseIgnore,  params, limit) {
    if (!params) {
        params = $location.search();
        $scope.params = params;

    }

    limit = limit || 18;

    var q =  params.q && params.q.trim();

    $scope.userList = [];
    $scope.userDataSource = new Model.objects.dataSource({
        modelClass: User,
        orderBy: '-ordering',
        $scope: $scope,
        itemListProp: 'userList',
        infinite: true,
        //page: 1,
        limit: limit,
        params: params,
        clearBeforeLoad: clearBeforeLoad,
        caseIgnore: caseIgnore
    });
    $scope.userDataSource.loadMore();

    $scope.commonList = [];
    $scope.commonDataSource = new Model.objects.dataSource({
        modelClass: Search,
        orderBy: '-score',
        $scope: $scope,
        itemListProp: 'commonList',
        infinite: true,
        page: 1,
        limit: limit,
        params: _.extend({content_type: content_type}, params),
        clearBeforeLoad: clearBeforeLoad,
        caseIgnore: caseIgnore
    });
    $scope.commonDataSource.loadMore();
}

// TODO: move to settings
var SEARCH_CONTENT_TYPES = ['goals.Goal', 'goals.TeamGoal', 'updates.Update'];

function SearchCtrl ($scope, $location, Model, Search, User, Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn();

    searchHelper($scope, $location, Model, Search, User, SEARCH_CONTENT_TYPES, false, false);
    $scope.$on('$locationChangeSuccess', function (event, current, previous) {
        searchHelper($scope, $location, Model, Search, User, SEARCH_CONTENT_TYPES, false, false);
    });


}

function SearchBoxCtrl ($scope, $location, Model, Search, User, $timeout) {
    $scope.keywords = $location.search().q;
    $scope.search = function (form) {
        $location.path('/search').search({q: $scope.keywords});
    };

    var liveSearchTimeout;

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        $scope.showResult = false;

        if ($location.path() != '/search') {
            if ($scope.$parent.closeSearch) {
                $scope.$parent.closeSearch();
            }
            $scope.keywords = '';
        }

    });

    var caseIgnore = function (options) {
        return options.params.q != options.$scope.keywords;
    };

    $scope.liveSearch = function (keywords) {

        $scope.showResult = ($location.path() != '/search');

        if (liveSearchTimeout) {
            $timeout.cancel(liveSearchTimeout);
        }

        liveSearchTimeout = $timeout(function() {
            var params = {q: keywords};
            var limit = 4;
            searchHelper ($scope, $location, Model, Search, User, SEARCH_CONTENT_TYPES, true, caseIgnore, params, limit);
        }, 250);


    };

    var resultActive = false;
    $scope.resultFocus = function ($event) {
        resultActive = true;
        $timeout(function() {
            resultActive = false;
        }, 100);
    };

    $scope.inputBlur = function ($event) {
        $event.preventDefault();
        $timeout(function() {
            if (!resultActive) {
                $scope.showResult = false
            }

        }, 100);
    }
}