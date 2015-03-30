'use strict';

angular.module('odmbase').factory('Model', ['$q', 'Image', '$injector', function Model($q, Image, $injector) {

    var Model = {field: {}, objects: {}, build: {}, request: {}};

    Model.field.foreignKeyWithData = function (modelClass, data) {
        var model = modelClass.one();
        _.extend(model, data);
        if (model.buildModel) {
            model = model.buildModel(model);
        }
        return model;
    };

    Model.build.manyToManyWithData = function (fieldList, data) {
        angular.forEach(fieldList, function (field) {

            if (typeof(field) == 'object') {
                var modelName = field[1];
                var modelClass = $injector.get(modelName);
                var model = modelClass.one();

                field = field[0];
            }

            var fieldData = data[field];

            if (fieldData && !fieldData.all) {
                fieldData = {
                    all: fieldData || []
                }
            }

            if (fieldData && model && model.buildModel) {
                Model.objects.buildWithDataList(modelClass, fieldData.all, model.buildModel)
            }

            data[field] = fieldData;
        });
        return data;
    };


    Model.build.imageSaveList = function (element) {
        if (!element['image_set']) {
            element['image_set'] = {};
        }
        element['image_set'].saveList = function (callback) {

            var promises = [];
            var deletePromsies = [];

            var createPromisesFn = function(model, method, promiseCollectors) {
                return function(image, key) {

                    var apiCommon = '/api/v1/common/';

                    var _image = Image.one(image.id);
                    _image.attach_to = apiCommon + model.id + "/";
                    promiseCollectors.push(_image[method].call(_image, undefined));

                }
            }

            // update all images

            angular.forEach(element['image_set'].all, createPromisesFn(element, 'put', promises));
            angular.forEach(element['image_set'].deleteImageSet, createPromisesFn(element, 'remove', deletePromsies));

            $q.all([
                $q.all(promises).then(function() { return arguments }),
                $q.all(deletePromsies).then(function() { return arguments })
            ]).then(function(somethingIDontKnow) {
                callback(somethingIDontKnow);
            });

        }
        return element;
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

    Model.request.foreignKeyWithData = function(fieldList, data) {

        angular.forEach(fieldList, function (field) {
            if (typeof data[field] == 'object' && data[field].resource_uri) {
                data[field] = data[field].resource_uri;
            }
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