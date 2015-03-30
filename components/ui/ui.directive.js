
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
      createdBy: '=',
      isDetail: '=',
      param: '='
    },
    controller: function($scope) {
      if ($scope.createdBy) {
        $scope.model.created_by = $scope.createdBy;
      }
        if ($scope.model && $scope.model.resource_uri) {
          $scope.model.elemId = $scope.model.resource_uri.replace(/\//g, '-').substr(0, $scope.model.resource_uri.length - 1).replace('-api-v1-', '');
        }
    }

  };

});

var mediaRenderOrModalLink = {
  restrict: 'A',
  scope: {
    model: '=',
    media: '=',
    isModal: '@',
    templateItemUrl: '=',
    param: '=?'
  },
  controller: function($scope, Modal) {
    var _isModal;
    if ($scope.isModal) {
      _isModal = '_'.concat($scope.isModal);
    } else {
      _isModal = '';
    }
    $scope.param = $scope.param || {};
    $scope.templateUrl = '/static/app/odmbase/components/ui/templates/render/'.concat($scope.media, _isModal, '.html');
    $scope.modalOpen = function (modalUrl) {
      $scope.param = _.extend({model: $scope.model}, $scope.param);
      Modal.open(modalUrl, 'lg', $scope.param);
    };
  }

};

angular.module('odmbase').directive('mediaRender', function () {

  var mediaRender = _.cloneDeep(mediaRenderOrModalLink);
  mediaRender['templateUrl'] = '/static/app/odmbase/components/ui/templates/render/template_item.html';

  return mediaRender;

});

angular.module('odmbase').directive('mediaModalLink', function () {

  var mediaModalLink = _.cloneDeep(mediaRenderOrModalLink);
  mediaModalLink['template'] = function(elem, attr){
    return angular.element('<a href="" ng-click="modalOpen(templateItemUrl)"></a>').append(elem.html());
  };

  return mediaModalLink;
});

angular.module('odmbase').directive('focusMe', function($timeout, $parse) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
});