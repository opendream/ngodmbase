'use strict';

angular.module('odmbase').factory('Model', [function Model() {

    var Model = {field: {}, objects: {}, build: {}};

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