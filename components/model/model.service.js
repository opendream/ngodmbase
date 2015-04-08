'use strict';

angular.module('odmbase').factory('Model', ['$q', 'Image', '$injector', function Model($q, Image, $injector) {

    var Model = {field: {}, objects: {}, build: {}, request: {}};

    Model.field.foreignKeyWithData = function (modelClass, data) {
        if (!data) {
            return data;
        }
        var model = modelClass.one();
        _.extend(model, data);
        if (model.buildModel) {
            model = model.buildModel(model);
        }
        return model;
    };

    Model.build.manyToManyWithData = function (fieldList, data) {
        if (!data) {
            return data;
        }

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
        if (!element) {
            return element;
        }

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
            };

            // update all images

            angular.forEach(element['image_set'].all, createPromisesFn(element, 'put', promises));
            angular.forEach(element['image_set'].deleteImageSet, createPromisesFn(element, 'remove', deletePromsies));

            $q.all([
                $q.all(promises).then(function() { return arguments }),
                $q.all(deletePromsies).then(function() { return arguments })
            ]).then(function(somethingIDontKnow) {
                callback(somethingIDontKnow);
            });

        };
        return element;
    };

    Model.request.manyToManyWithData = function (fieldList, data) {
        angular.forEach(fieldList, function (field) {
            var fieldData = null;

            if (data[field]) {
                fieldData = [];
                angular.forEach(data[field].all, function (item, ignore) {
                    if (typeof item == 'string') {
                        fieldData.push(item);
                    }
                    else if (item.resource_uri) {
                        fieldData.push(item.resource_uri);
                    }
                });
            }
            data[field] = fieldData;
        });

        return data;
    };

    Model.request.  foreignKeyWithData = function(fieldList, data, use_common) {

        angular.forEach(fieldList, function (field) {
            if (typeof data[field] == 'object') {
                if (use_common && data[field].common_resource_uri) {
                    data[field] = data[field].common_resource_uri;
                }
                else if (data[field].resource_uri) {
                    data[field] = data[field].resource_uri;

                }
            }
            else if (typeof data[field] != 'string') {
                data[field] = null;
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
                var args = data.resource_uri.split('/');
                _.merge(data, modelClass.one(args[args.length-2]));
            });
            return dataList;
        }
    };

    Model.objects.dataSource = function (options) {

        var modelClass = options.modelClass;
        var orderBy = options.orderBy;
        var params = options.params;
        var $scope = options.$scope;
        var itemListProp = options.itemListProp;
        var reverse = options.reverse;
        var infinite = options.infinite;

        var self = this;
        params = params || {};
        if (orderBy) {
            params.order_by = orderBy;
        }

        self.ordering = null;
        self.disableLoadMore = false;
        self.busy = false;
        self.limit = null; // When first time api request, we know this limit
        self.remain = null; // When first time api request, we know this limit

        self.load = function (ordering, callback) {

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

                self.limit = resp.meta.limit;
                self.remain = Math.max(0, resp.meta.total_count - self.limit);

                if (!infinite && self.remain <= 0) {
                    self.disableLoadMore = true;
                }

                if (resp.objects.length) {
                    if (reverse) {
                        resp.objects = resp.objects.reverse();
                        $scope[itemListProp] = resp.objects.concat($scope[itemListProp]);
                    }
                    else {
                        $scope[itemListProp] = $scope[itemListProp].concat(resp.objects);
                    }

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
                //self.ordering = resp.objects[resp.objects.length-1][orderBy.replace('-', '')];
                var latestIndex = reverse? 0: resp.objects.length-1;
                self.ordering = resp.objects[latestIndex][orderBy.replace('-', '')];
            });
        }

        return self;


    };

    return Model;


}]);