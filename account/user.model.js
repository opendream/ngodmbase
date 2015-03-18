'use strict';

angular
    .module('odmbase')
    .factory('User', ['Restangular', 'md5', User]);

function User (Restangular, md5) {

  var modelName = 'user';
  var restangular = Restangular.withConfig(function(RestangularConfigurer) {

    var buildModel = function (element) {
        element.getImage = function() {
           if (this.image) {
             return this.image_thumbnail_1x.url;
           }
           else {
             return 'http://www.gravatar.com/avatar/' + md5(this.email) + '?d=mm';
           }
         };
        return element;
    };


    RestangularConfigurer.setResponseExtractor(function(element, operation, route, url) {
      return buildModel(element);
    });
    RestangularConfigurer.extendModel(modelName, function (element) {
      return buildModel(element);
    });

    RestangularConfigurer.addElementTransformer(modelName, false, function(element) {

      element.addRestangularMethod('me', 'get', 'me', undefined);
      element.addRestangularMethod('social_sign', 'post', 'social_sign', undefined);

      return element;
    });

    RestangularConfigurer.setRestangularFields({
      selfLink: 'resource_uri'
    });

  });

  var user = restangular.service(modelName);

  return user;

}