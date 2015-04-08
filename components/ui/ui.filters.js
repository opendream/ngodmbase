
angular.module('odmbase').filter('pluck', function () {
    return function(objects, property) {
        return _.pluck(objects, property);
    }
});
