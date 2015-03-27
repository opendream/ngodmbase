
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

angular.module('odmbase').directive('imageRender', function() {
  return {
    restrict: 'A',
    templateUrl: '/static/app/odmbase/components/ui/templates/render/image.html',
    scope: {
      style: '@',
      url: '=',
      elementClass: '@',
      ratio: '@',
      crop: '='
    },
    controller: function($scope) {
        $scope.style = $scope.style || 'ratio'; // ratio, static
        $scope.ratio = $scope.ratio || (1/1);

        $scope.padding = 1/$scope.ratio*100;
        if ($scope.crop) {
            $scope.cropClass = 'image-crop'
        }
    }

  };
});


angular.module('odmbase').directive('dateParser', function () {
  return {
    link: link,
    restrict: 'A',
    require: 'ngModel'
  };

  function link(scope, element, attrs, ngModel) {
    var moment = window.moment,
      dateFormat = attrs.dateParser,
      alternativeFormat = dateFormat.replace('DD', 'D').replace('MM', 'M'); //alternative do accept days and months with a single digit

    //use push to make sure our parser will be the last to run
    ngModel.$formatters.push(formatter);
    ngModel.$parsers.push(parser);

    function parser(viewValue) {
      var value = ngModel.$viewValue; //value that none of the parsers touched
      if(value) {
        var date = moment(value, [dateFormat, alternativeFormat], true);
        ngModel.$setValidity('date', date.isValid());
        return date.isValid() ? date._d : value;
      }

      return value;
    }

    function formatter(value) {
      var m = moment(value);
      var valid = m.isValid();
      if (valid) return m.format(dateFormat);
      else return value;
    }
  }

});

angular.module('odmbase').directive('templateItem', function () {
  return {
    restrict: 'A',
    templateUrl: '/static/app/odmbase/components/ui/templates/render/template_item.html',
    scope: {
      model: '=',
      templateUrl: '=',
      createdBy: '='
    },
    controller: function($scope) {
      if ($scope.createdBy) {
        $scope.model.created_by = $scope.createdBy;
      }
    }

  };

});

angular.module('odmbase').directive('mediaRender', function () {
  return {
    restrict: 'A',
    templateUrl: '/static/app/odmbase/components/ui/templates/render/template_item.html',
    scope: {
      model: '=',
      media: '=',
      isModal: '@'
    },
    controller: function($scope, Modal) {
      var _isModal;
      if ($scope.isModal) {
        _isModal = '_'.concat($scope.isModal);
      } else {
        _isModal = '';
      }
      $scope.templateUrl = '/static/app/odmbase/components/ui/templates/render/'.concat($scope.media, _isModal, '.html');

      $scope.modalOpen = function (modalUrl) {
        Modal.open(modalUrl, null, {model: $scope.model});
      };
    }

  };

});
