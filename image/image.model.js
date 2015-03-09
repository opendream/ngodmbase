'use strict';

angular.module('odmbase')
  .factory('Image', ['Restangular', function (Restangular) {

    var modelName = 'image';
    var restangular = Restangular.withConfig(function(RestangularConfigurer) {

    });

    var model = restangular.service(modelName);

    return model;

  }]);
