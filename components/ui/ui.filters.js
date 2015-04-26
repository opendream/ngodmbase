
angular.module('odmbase')
    .filter('pluck', function () {
        return function(objects, property) {
            return _.pluck(objects, property);
        }
    })

    .filter('diffTimeByDay', function () {
        return function(date) {
            var refDate = moment();
            var days = moment(date).diff(refDate, 'days');
            days = Math.max(0, days);

            return days;
        }
    });