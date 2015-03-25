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

    Model.objects.dataSource = function (modelClass, orderBy, params, $scope, itemListProp) {

        var self = this;
        params = params || {};
        if (orderBy) {
            params.order_by = orderBy;
        }

        self.ordering = null;
        self.disableLoadMore = false;
        self.busy = false;

        self.load = function (ordering, callback) {
            console.log(self.busy);
            if (self.disableLoadMore || self.busy) {
                return;
            }
            self.busy = true;

            self.params = _.clone(params);

            if (orderBy) {
                var sort = 'gt';
                if (orderBy.indexOf('-') == 0) {
                    sort = 'lt';
                }
                self.params[orderBy.replace('-', '') + '__' + sort] = ordering;
            }

            modelClass.one().get(self.params).then(function (resp) {
                if (resp.objects.length) {
                    $scope[itemListProp] = $scope[itemListProp].concat(resp.objects);
                    if (callback) {
                        callback(resp);
                    }
                    self.busy = false;

                }
                else {
                    self.disableLoadMore = true;
                }
            });
        };

        self.loadMore = function () {
            self.load(self.ordering, function (resp) {
                self.ordering = resp.objects[resp.objects.length-1][orderBy.replace('-', '')];
            });
        }

        return self;


    };

    return Model;


}]);