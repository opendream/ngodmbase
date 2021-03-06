'use strict';

angular
        .module('odmbase')
        .factory('User', ['Restangular', 'md5', 'Model', User]);

function User (Restangular, md5, Model) {

    var self = this;
    var modelName = 'user';


    self.buildModel = function (element) {
        element.getImage = function() {

            if (this.get_image) {
                return this.get_image;
            }

            if (this.image) {
                return this.image_thumbnail_1x.url;
            }
            else {
                var email = this.email || '';
                return 'http://www.gravatar.com/avatar/' + md5(email) + '?d=mm';
            }
        };

        if (typeof buildExtraUserModel != 'undefined') {
                element = buildExtraUserModel(element, Model);
        }

        return element;
    };

    self.RequestModel = function (element, operation, route, url) {
        if (operation == 'put') {
            delete element.image;
        }
        if (typeof RequestExtraUserModel != 'undefined') {
                element = RequestExtraUserModel(element, operation, route, url, Model);
        }
        return element;
    }

    var restangular = Restangular.withConfig(function(RestangularConfigurer) {


        RestangularConfigurer.setResponseExtractor(function(element, operation, route, url) {
            Model.objects.buildWithDataList(Restangular.service(modelName), element.objects, self.buildModel);
            return self.buildModel(element);
        });
        RestangularConfigurer.extendModel(modelName, function (element) {
            return self.buildModel(element);
        });

        RestangularConfigurer.addElementTransformer(modelName, false, function(element) {

            element.addRestangularMethod('me', 'get', 'me', undefined);
            element.addRestangularMethod('social_sign', 'post', 'social_sign', undefined);
            element.addRestangularMethod('change_password', 'post', 'change_password', undefined);
            element.addRestangularMethod('forgot_password', 'post', 'forgot_password', undefined);
            element.addRestangularMethod('reset_password', 'post', 'reset_password', undefined);

            if (typeof RequestExtraRestangularMethod != 'undefined') {
                element = RequestExtraRestangularMethod(element);
            }

            return element;
        });

        RestangularConfigurer.setRequestInterceptor(function(element, operation, route, url) {

            self.RequestModel(element, operation, route, url);
            return element;
        });

        RestangularConfigurer.setRestangularFields({
            selfLink: 'resource_uri'
        });

    });

    var user = restangular.service(modelName);

    return user;

}