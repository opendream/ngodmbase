
angular.module('odmbase').directive('setClassWhenAtTop', function ($window) {
  var $win = angular.element($window); // wrap window object as jQuery object

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
          offsetTop = element.offset().top; // get element's offset top relative to document

      $win.on('scroll', function (e) {
        if ($win.scrollTop() >= offsetTop) {
          element.addClass(topClass);
        } else {
          element.removeClass(topClass);
        }
      });
    }
  };
});


angular.module('odmbase').directive('lineBreaks', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      return ctrl.$render = function() {
        if (ctrl.$modelValue == null) {
          return;
        }
        return element.html(ctrl.$modelValue.replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>'));
      };
    }
  };
});
