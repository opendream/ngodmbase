'use strict';

angular.module('odmbase')
    .directive('fieldMedia', function() {
    return {
        restrict: 'A',
        templateUrl: '/static/app/odmbase/components/form/templates/fields/media.html',
        scope: {
            model: '=',
            form: '=',
            submitted: '=',
            maxUploads: '@',
            labelClass: '@',
            fieldClass: '@',
            helpClass: '@'
        },
        // TODO: split one file per one field type T_T
        controller: function($scope) {


        }
    }
});
