angular
    .module('odmbase')
    .factory('Message', ['Restangular', 'User', 'Model', Message]);

function Message (Restangular, User, Model) {

    var modelName = 'message';

    var self = this;

    var restangular = Restangular.withConfig(function(RestangularConfigurer) {

        var _buildModel = function (element) {

            element.src = Model.field.foreignKeyWithData(User, element.src);
            element.dst = Model.field.foreignKeyWithData(User, element.dst);


            return element;
        };

        var buildModel = function (element) {
            element = _buildModel(element);
            element.buildModel = _buildModel;
            return element;
        }
        var requestModel = function (element, operation, route, url) {
            Model.request.foreignKeyWithData(['dst'], element);
            return element;
        };

        RestangularConfigurer.setResponseExtractor(function(element, operation, route, url) {
            Model.objects.buildWithDataList(Restangular.service(modelName), element.objects, buildModel);
            return buildModel(element)

        });

        RestangularConfigurer.extendModel(modelName, function (element) {
            return buildModel(element)
        });

        RestangularConfigurer.setRequestInterceptor(function(element, operation, route, url) {

            requestModel(element, operation, route, url);
            return element;
        });

    });

    var model = restangular.service(modelName);

    return model;
}