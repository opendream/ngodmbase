'use strict';

angular.module('odmbase').factory('Model', [function Model() {

    var Model = {field: {}, objects: {}, build: {}, request: {}};

    Model.field.foreignKeyWithData = function (modelClass, data) {
        var model = modelClass.one();
        _.extend(model, data);
        return model;
    };

    Model.build.manyToManyWithData = function (fieldList, data) {
        angular.forEach(fieldList, function (field) {
            var fieldData = data[field];

            if (fieldData && !fieldData.all) {
                fieldData = {
                    all: fieldData || [],
                    saveList: function () {
                        //TODO: make it work
                    }
                }
            }
            data[field] = fieldData;
        });
        return data;
    };

    Model.request.manyToManyWithData = function (fieldList, data) {
        angular.forEach(fieldList, function (field) {
            var fieldData = [];

            angular.forEach(data[field].all, function (item, ignore) {
                if (typeof item == 'string') {
                    fieldData.push(item);
                }
                else if (item.resource_uri) {
                    fieldData.push(item.resource_uri);
                }
            });
            data[field] = fieldData;
        });

        return data;
    };

    // Deprecate to buildWithDataList
    Model.objects.manyToManyWithDataList = function (modelClass, dataList, callback) {

        if (dataList && dataList.length) {
            angular.forEach(dataList, function (data) {
                callback(data);
            });
            return dataList;
        }
    };

    Model.objects.buildWithDataList = function (modelClass, dataList, callback) {

        if (dataList && dataList.length) {
            angular.forEach(dataList, function (data) {
                callback(data);
            });
            return dataList;
        }
    };


    return Model;


}]);