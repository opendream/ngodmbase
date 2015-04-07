'use strict';

angular
    .module('odmbase')
    .directive('field', CommonField);

function CommonField () {
    return {
        restrict: 'A',
        templateUrl: '/static/app/odmbase/components/form/templates/fields/base.html',
        scope: {
            model: '=',
            form: '=',
            submitted: '=',
            maxUploads: '@',
            referenceModel: '@',
            params: '=',
            type: '@',
            label: '@',
            placeholder: '@',
            name: '@',
            help: '@',
            required: '=',
            readonly: '=',
            min: '@',
            max: '@',
            step: '@',
            error: '=',
            suffix: '@',
            options: '=?',
            labelClass: '@',
            fieldClass: '@',
            helpClass: '@',
            itemClass: '@',
            itemTemplateUrl: '=',
            itemList: '=?',
            itemLabel: '@',
            itemKey: '@',
            tagsLoad: '=',
            tagsDisplayProperty: '@',
            odmChange: '=',
            ngFocus: '=',
            ngBlur: '='
        },
        // TODO: split one file per one field type T_T
        controller: function($scope, $element, $injector, $upload, $q, Modal, Model, Image) {

            // simple lib include
            $scope.Math = window.Math;
            $scope.moment = window.moment;

            if ($scope.referenceModel) {
                $scope.referenceModel = $injector.get($scope.referenceModel);
            }

            if ($scope.type == 'text-angular') {
                // Holy bug of text-angular
               $scope.model[$scope.name] = $scope.model[$scope.name] || "";
            }

            else if ($scope.type == 'text-angular-inline') {
                // Holy bug of text-angular
               $scope.model[$scope.name] = $scope.model[$scope.name] || "";
            }

            else if ($scope.type == 'select-reference') {

                $scope.referenceModel.one().get($scope.params).then(function (data) {
                    $scope.itemList = data.objects;
                });
            }

            else if ($scope.type == 'select-multiple-reference') {

                $scope.referenceModel.one().get().then(function (data) {
                    $scope.itemList = data.objects;
                });
            }

            else if ($scope.type == 'checkbox-multiple-reference') {

                $scope.referenceModel.one().get().then(function (data) {
                    $scope.itemList = data.objects;

                });

                $scope.$watch('model', function (newValue, oldValue) {
                    updateSelectedList();
                });

                var updateSelectedList = function () {
                    if (!$scope.model) {
                        return;
                    }
                    var allDict = {};
                    angular.forEach($scope.model[$scope.name].all, function(item, ignore) {
                        allDict[item.resource_uri] = true;
                    });
                    $scope.model[$scope.name].allDict = allDict;
                };

                $scope.selectItem = function (item) {
                    updateSelectedList()

                    if ($scope.model[$scope.name].allDict[item.resource_uri]) {
                        _.remove($scope.model[$scope.name].all, {
                            resource_uri: item.resource_uri
                        });
                    }
                    else {
                        $scope.model[$scope.name].all.push(item);
                    }
                    updateSelectedList();
                }

            }

            else if ($scope.type == 'select-list') {

                //$scope.referenceModel.one().get($scope.params).then(function (data) {
                //    $scope.itemList = data.objects;
                //});
                $scope.$watch('model.' + $scope.name, function (newValue, oldValue) {

                    if (!newValue) {
                        $scope.selectedItem = null;
                    }
                    console.log('model', newValue);
                    //console.log($scope.itemLabel);
                    //$scope.options = $scope.itemList;
                });
                $scope.selectSingleItem = function (item) {
                    $scope.selectedItem = item;
                    console.log('item', item);
                    //console.log('model', $scope.model[$scope.name]);
                    //$scope.model[$scope.name] = item;
                };
            }


            else if ($scope.type == 'image-set') {

                //$scope.maxUploads = $scope.maxUploads || 9999999;


                $scope.model[$scope.name] = {all: []};
                $scope.nameItem = $scope.name.replace('_set', '');

                $scope.$watch('model', function (newValue, oldValue) {
                    updateImageList();
                });

                var updateImageList = function () {

                    // case model build form empty
                    if (!$scope.model[$scope.name]) {
                        $scope.model[$scope.name] = {};
                    }
                    // case model build form empty object
                    if (!$scope.model[$scope.name].all) {
                        $scope.model[$scope.name].all = [];
                    }


                    $scope.numImageFiles = $scope.model[$scope.name].all.length;
                    $scope.imageList = [];
                    $scope.model[$scope.name].deleteImageSet = [];

                    if ($scope.maxUploads) {
                        for (var i = 0; i < $scope.maxUploads; i++) {
                            var imageData = $scope.model[$scope.name].all[i];
                            imageData = imageData ? {data: imageData} : null;
                            $scope.imageList.push(imageData);
                        }
                    }
                    else {
                        angular.forEach($scope.model[$scope.name].all, function(imageData, key) {
                            $scope.imageList.push(imageData)
                            //a.splice(a.length-1, 0, 'z')
                        });
                        $scope.imageList.push(null);
                    }
                };

                var removeImageClient = function (index) {

                    $scope.form[$scope.name].$dirty = true;

                    $scope.imageList.splice(index, 1);
                    $scope.imageList.push(null);
                    $scope.numImageFiles--;

                    if ($scope.model[$scope.name].all.length == 1) {
                        $scope.model[$scope.name].all = [];
                    } else {
                        $scope.model[$scope.name].all.splice(index, 1);
                    }
                    if (!$scope.maxUploads) {
                        $scope.imageList = $scope.imageList.slice(0, $scope.numImageFiles+1);
                    }
                };

                $scope.upload = function (files) {

                    if (files && files.length) {

                        if ($scope.maxUploads && $scope.numImageFiles + files.length > $scope.maxUploads) {
                            Modal.open('/static/app/odmbase/components/modal/upload_limit_modal.html', null, {
                                numRemaining: $scope.maxUploads - $scope.numImageFiles
                            });
                            return false;
                        }

                        for (var i = 0; i < files.length; i++) {

                            var file = files[i];
                            $upload.upload({
                                url: '/api/v1/image/',
                                file: file,
                                fileFormDataName: 'image'
                            }).progress(function (evt) {
                                if (typeof evt.config.index == 'undefined') {
                                    evt.config.index = $scope.numImageFiles;
                                    $scope.numImageFiles++;
                                }
                                $scope.imageList[evt.config.index] = {
                                    'progressPercentage': parseInt(100.0 * evt.loaded / evt.total)
                                };

                                if (!$scope.maxUploads) {
                                    $scope.imageList[$scope.numImageFiles] = null;
                                }
                            }).success(function (data, status, headers, config) {
                                $scope.model[$scope.name].all.push(data);
                                $scope.form[$scope.name].$dirty = true;
                                $scope.imageList[config.index]['data'] = data;
                            }).error(function (data, status, headers, config) {
                                if (status == 413) {
                                  // TODO: alert custom message
                                }
                                else {
                                  // TODO: alert default message
                                }
                                $scope.form[$scope.name].$dirty = true;
                                removeImageClient(config.index);

                            });
                        }
                        console.log($scope.imageList);
                    }
                };

                $scope.removeImage = function (image, index) {

                    $scope.model[$scope.name].deleteImageSet.push(image);
                    removeImageClient(index);

                };

            }


        }
    }
}
