angular
  .module('odmbase')
  .directive('parallax', ['$window', '$timeout', ODMParallax]);

function ODMParallax ($window, $timeout) {
  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      imageSrc: '@imageSrc'
    },
    template: '<div class="parallax-bg" ng-style="backgroundImagePosition" style="background-image:url({{imageSrc}}); height:{{imageHeight}}px"></div><div class="parallax-story" max-height="{{windowHeight}}px" ng-transclude></div>',
    link: function postLink(scope, element, attrs) {

      var windowResizeEvent = "resize",
          windowScrollEvent = "scroll";
      scope.imageBackgroundPostionY = 500;
      scope.speedFactor = 0.5;

      var setHeight = function () {
        $timeout(function () {
          var height = $(window).height();
          element.height(height);
          scope.windowHeight = height;
          scope.imageHeight = height + (scope.speedFactor * height);
        });
      }

      var parallax = function () {
        var windowHeight = $($window).height();
        var windowTop = $($window).scrollTop();
        var windowBottom = windowTop + windowHeight;

        var $element = $(element);
        var sectionHeight = $element.height();
        var sectionTop = $element.offset().top;
        var sectionBottom = sectionTop + sectionHeight;

        var bgY;
        var maxY;

        if (sectionTop < windowBottom && sectionBottom > windowTop) {
          $timeout(function () {
            bgY = Math.round(-(windowTop - sectionTop) * scope.speedFactor);
            scope.backgroundImagePosition = {"background-position" : '50% ' + bgY + "px"};
          });
        }

      }

      angular.element(window).bind(windowResizeEvent, function() {
        setHeight();
      });

      angular.element(window).bind(windowScrollEvent, function() {
        parallax();
      }).resize(parallax);

      setHeight();
      parallax();
    }
  };
}
