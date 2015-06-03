angular
    .module('mtd')
    .factory('Search', ['Restangular', 'Model', '$injector', Search]);

function Search (Restangular, Model, $injector) {

    var modelName = 'search';
    var restangular = Restangular.withConfig(function(RestangularConfigurer) {

        var buildModel = function (element) {


            if (element.item && element.item.inst_name) {
                var modelClass = $injector.get(element.item.inst_name);
                element.item = Model.field.foreignKeyWithData(modelClass, element.item);
            }

            return element;
        };

        RestangularConfigurer.setResponseExtractor(function(element, operation, route, url) {
            //console.log(element);
            Model.objects.buildWithDataList(Restangular.service(modelName), element.objects, buildModel);
            return buildModel(element)

        });

        RestangularConfigurer.extendModel(modelName, function (element) {
            return buildModel(element)
        });

    });

    var model = restangular.service(modelName);

    return model;

}