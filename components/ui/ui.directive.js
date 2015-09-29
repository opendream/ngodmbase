
angular.module('odmbase').directive('setClassWhenAtTop', function ($window) {
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                offsetTop = element.offset().top; // get element's offset top relative to document

            $win.on('scroll', function () {
                if ($win.scrollTop() >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
});

angular.module('odmbase').directive('outviewHidden', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            'viewport': '@'
        },
        link: function (scope, element) {
            if (!Modernizr.touch) return;

            var viewport = angular.element(scope.viewport);

            var processingTimer = null,
                processingDelay = 50; // 50ms

            viewport.on('scroll', function (e) {
                if (processingTimer) clearTimeout(processingTimer);
                processingTimer = $timeout(function () {
                    process();
                }, processingDelay);

                function process() {
                    var images = $('img', element),
                        dummies = $('.img-outview', element),
                        elmHeight = element.height(),
                        elmTop = element.offset().top,
                        viewportTop = viewport.offset().top,
                        viewportScrollTop = viewport.scrollTop(),
                        viewportHeight = viewport[0].offsetHeight,
                        offset = viewportHeight;

                    // console.log('DEBUG: check to hide images', element, elmHeight, elmTop, viewportScrollTop, viewportHeight);
                    if (elmHeight + elmTop < viewportTop - offset) {
                        // console.log('DEBUG: over viewport', element[0], elmHeight, elmTop, viewportScrollTop);
                        sendImagesToAnotherUniverse(images);
                        // element.css('visibility', 'hidden');
                    }
                    else if (elmTop > viewportTop + viewportHeight + offset) {
                        // console.log('DEBUG: below viewport', element[0], elmTop, viewportScrollTop, viewportHeight);
                        sendImagesToAnotherUniverse(images);
                        // element.css('visibility', 'hidden');
                    }
                    else {
                        // TODO: bring img back.
                        // console.log('DEBUG: in viewport');
                        // element.css('visibility', 'visible');
                        $(dummies).each(function (index, dummy) {
                            // console.log('DEBUG: bringing back img');
                            $(dummy).append($(dummy).data('img'));
                        });
                    }
                }
            });
        }
    };
});

angular.module('odmbase').directive('outviewHiddenWindow', function ($timeout) {
    function getBox(element) {
        return $(element)[0].getBoundingClientRect();
    }

    return {
        restrict: 'A',
        link: function (scope, element) {
            if (!Modernizr.touch) return;

            var viewport = $(window);

            var processingTimer = null,
                processingDelay = 50; // 50ms

            viewport.on('scroll', function (e) {
                if (processingTimer) clearTimeout(processingTimer);
                processingTimer = $timeout(function () {
                    process();
                }, processingDelay);

                function process() {
                    var images = $('img', element),
                        dummies = $('.img-outview', element),
                        box = getBox(element),
                        viewportHeight = viewport.height(),
                        offset = viewportHeight;

                    if (box.bottom < -offset) {
                        sendImagesToAnotherUniverse(images);
                    }
                    else if (box.top > viewportHeight + offset) {
                        sendImagesToAnotherUniverse(images);
                    }
                    else {
                        $(dummies).each(function (index, dummy) {
                            if ($(dummy).children().length === 0) {
                                $(dummy).append($(dummy).data('img'));
                            }
                        });
                    }
                }
            });
        }
    };
});

function sendImagesToAnotherUniverse(images) {
    $(images).each(function (index, img) {
        var dummy;

        if (!$(img).data('dummy')) {
            dummy = $('<div class="img-outview"></div>');
            dummy.attr('id', Math.random() * 10);
            dummy.css('min-height', img.offsetHeight);
            dummy.css('min-width', img.offsetWidth);
            dummy.data('img', img);

            $(img).wrap(dummy);
            $(img).data('dummy', $(img).parent('.img-outview'));
        }
        else {
            dummy = $(img).data('dummy');
        }

        // console.log('DEBUG: check for detaching img from dummy', img, dummy);
        if (dummy.children('img').length > 0) {
            $(img).detach();
        }
    });
}

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
        controller: ['$scope', function($scope) {
            $scope.style = $scope.style || 'ratio'; // ratio, static
            $scope.ratio = $scope.ratio || (1/1);

            $scope.padding = 1/$scope.ratio*100;
            if ($scope.crop) {
                $scope.cropClass = 'image-crop'
            }
            else {
                $scope.cropClass = 'image-contain'
            }
        }]

    };
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

angular.module('odmbase').filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

angular.module('odmbase').directive('templateItem', function () {
    return {
        restrict: 'A',
        templateUrl: '/static/app/odmbase/components/ui/templates/render/template_item.html',
        scope: {
            model: '=',
            templateUrl: '=',
            createdBy: '=?',
            isDetail: '=?',
            param: '=?'
        },
        controller: ['$scope', function($scope) {
            if ($scope.createdBy) {
                $scope.model.created_by = $scope.createdBy;
            }
            if ($scope.model && $scope.model.resource_uri) {
                $scope.model.elemId = $scope.model.resource_uri.replace(/\//g, '-').substr(0, $scope.model.resource_uri.length - 1).replace('-api-v1-', '');
            }

            this.scope = $scope;
        }]
    };
});

var mediaRenderOrModalLink = {
    restrict: 'A',
    scope: {
        model: '=',
        media: '=',
        isModal: '@',
        isDirect: '=?',
        templateItemUrl: '=',
        param: '=?',
        loginRequired: '='
    },
    controller: ['$scope', 'Modal', 'Auth', '$location', '$window', function($scope, Modal, Auth, $location, $window) {


        var _isModal;
        if ($scope.isModal) {
            _isModal = '_'.concat($scope.isModal);
        } else {
            _isModal = '';
        }
        $scope.Math = Math;
        $scope.param = $scope.param || {};

        var modalSize;
        $scope.$watch('model.media_selected', function (newVal, oldVal) {
            if (newVal || !$scope.model.id) {
                modalSize = 'lg';
                $scope.templateUrl = '/static/app/odmbase/components/ui/templates/render/'.concat($scope.media, _isModal, '.html');
            } else {
                var _default = 'default';
                modalSize = 'sm';
                $scope.templateUrl = '/static/app/odmbase/components/ui/templates/render/'.concat(_default, '.html');
            }
        });

        $scope.modalOpen = function ($event) {
            if ($scope.isDirect) {
                $location.path($scope.model.absolute_url);
                return;
            }
            else if ($window.ga) {
                $window.ga('send', 'pageview', { page: $scope.model.absolute_url });
            }

            if ($event) {
                $event.preventDefault();
            }


            if ($scope.loginRequired && !Auth.isLoggedIn()) {
                Modal.open('/static/app/odmbase/account/modal/login_modal.html');
                return;
            }

            $scope.param = _.extend({model: $scope.model}, $scope.param);
            Modal.open($scope.templateItemUrl, modalSize, $scope.param);
        };
    }]

};

angular.module('odmbase').directive('mediaRender', function () {

    var mediaRender = _.cloneDeep(mediaRenderOrModalLink);
    mediaRender['templateUrl'] = '/static/app/odmbase/components/ui/templates/render/template_item.html';

    return mediaRender;

});

angular.module('odmbase').directive('mediaModalLink', function () {

    var mediaModalLink = _.cloneDeep(mediaRenderOrModalLink);

    mediaModalLink['transclude'] = true;
    mediaModalLink['template'] = '<a ng-href="{{ model.absolute_url }}" ng-click="modalOpen($event)"><span ng-transclude></span></a>';

    return mediaModalLink;
});





angular.module('odmbase').directive('textfill', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        textfill: '=',
        textfillOnSuccess: '=',
        textfillOnFail: '=',
        textfillOnComplete: '='
      },
      template: '<span ng-bind-html="textfill"></span>',
      controller: ['$scope', function($scope) {
        $scope.textfill = $scope.textfill.replace('<p>', '').replace('</p>', '');
      }],
      link: function (scope, element, attr) {

        var container = element,
            options = {
              innerTag: attr.innerTag || "span",
              debug: attr.debug || false,
              minFontPixels: parseInt(attr.minFontPixels) || 4,
              maxFontPixels: parseInt(attr.maxFontPixels) || 40,
              widthOnly: attr.widthOnly || false,
              explicitHeight: attr.explicitHeight || null,
              explicitWidth: attr.explicitWidth || null,
              success: scope.textfillOnSuccess || null,
              fail: scope.textfillOnFail || null,
              complete: scope.textfillOnComplete || null
            };

        container.textfill(options);

        scope.$watch('textfill', function () {
          container.textfill(options);
        });
      }
    };
  });

angular.module('odmbase').directive('activeLink', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = attrs.href;

            scope.location = location;
            scope.$watch('location.path()', function(newPath) {

                if (element.parent()[0].tagName == 'LI') {
                     element.parent()[0];
                }
                if (path === newPath) {
                    element.addClass(clazz);
                    if (element.parent()[0].tagName == 'LI') {
                         $(element.parent()[0]).addClass(clazz);
                    }
                } else {
                    element.removeClass(clazz);
                    if (element.parent()[0].tagName == 'LI') {
                         $(element.parent()[0]).removeClass(clazz);
                    }
                }
            });
        }
    };
}]);


angular.module('odmbase').directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});

angular.module('odmbase').factory('clickAnywhereButHereService', function($document){
  var tracker = [];

  return function($scope, expr) {
    var i, t, len;
    for(i = 0, len = tracker.length; i < len; i++) {
      t = tracker[i];
      if(t.expr === expr && t.scope === $scope) {
        return t;
      }
    }
    var handler = function() {
      $scope.$apply(expr);
    };

    $document.on('click', handler);

    // IMPORTANT! Tear down this event handler when the scope is destroyed.
    $scope.$on('$destroy', function(){
      $document.off('click', handler);
    });

    t = { scope: $scope, expr: expr };

    tracker.push(t);
    return t;
  };
});

angular.module('odmbase').directive('clickAnywhereButHere', function($document, clickAnywhereButHereService){
  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      var handler = function(e) {
        e.stopPropagation();
      };
      elem.on('click', handler);

      scope.$on('$destroy', function(){
        elem.off('click', handler);
      });

      clickAnywhereButHereService(scope, attr.clickAnywhereButHere);
    }
  };
});

angular.module('odmbase').filter('timeago', function() {
    return function(date) {
        return moment.utc(date).fromNow();
    };
});


angular.module('odmbase').directive('odmCarouselScrollable', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {

            var currentScrollLeft = 0;
            var $ul = $(element).children('ul');

            angular.element($window).bind('resize',function(){
                $ul.animate({scrollLeft:0}, '0', 'swing', function() {
                    scope.$apply(function () {
                        currentScrollLeft = 0;
                        updateControl();
                    });
                });

            });

            scope.next = function () {
                $ul.animate((function () { return {scrollLeft:currentScrollLeft+$(element).width()}})(), '0', 'swing', function() {
                    scope.$apply(function () {
                        currentScrollLeft = $ul.scrollLeft();
                        updateControl();
                    });

                });
            };
            scope.prev = function () {
                $ul.animate((function () { return {scrollLeft:currentScrollLeft-$(element).width()}})(), '0', 'swing', function() {
                    scope.$apply(function () {
                        currentScrollLeft = $ul.scrollLeft();
                        updateControl();
                    });

                });
            };

            function updateControl () {
                var sumWidth = 0;
                $('li', $ul).each(function (i, item) {
                    sumWidth += $(item).outerWidth();
                });
                scope.showPrev = currentScrollLeft >= $(element).width()-1;
                scope.showNext = currentScrollLeft + $(element).width() < sumWidth-1;
            }
            setTimeout(updateControl, 1000);

        }
    };
}]);


app.directive('ngUp', function() {
    return {
        scope: {
            select: "&"
        },
        link: function(scope, element, attrs) {
            element.on("keyup", "[selectable]", function(event) {

                var $this = $(this);
                var selectedElement = {};

                scope.$apply(function() {
                    if (event.which === 40) {
                        selectedElement = $this.next("[selectable]");
                        if (selectedElement.length > 0) {
                            scope.select({
                                element: selectedElement
                            });
                        }
                    } else if (event.which === 38) {
                        selectedElement = $this.prev("[selectable]");
                        if (selectedElement.length > 0) {
                            scope.select({
                                element: $this.prev("[selectable]")
                            });
                        }
                    } else {

                    }
                });

                if (selectedElement.length > 0) {
                    $this.blur();
                    selectedElement.focus();
                }

            });
        }
    }
});
