'use strict';

angular.module('odmbase')
    .directive('field', function() {
    return {
        restrict: 'A',
        templateUrl: '/static/app/odmbase/components/form/templates/fields/base.html',
        scope: {
          model: '=',
          form: '=',
          submitted: '=',
          maxUploads: '@',
          referenceModel: '@',
          type: '@',
          label: '@',
          name: '@',
          help: '@',
          required: '=',
          readonly: '=',
          min: '@',
          step: '@',
          error: '=',
          suffix: '@',
          options: '=',
          labelClass: '@',
          fieldClass: '@',
          helpClass: '@'
        },
        // TODO: split one file per one field type T_T
        controller: function($scope, $injector, $upload, Modal) {

            if ($scope.type == 'text-angular') {
                // Holy bug of text-angular
               $scope.model[$scope.name] = $scope.model[$scope.name] || "";
            }

            else if ($scope.type == 'select-reference') {
              $scope.referenceModel = $injector.get($scope.referenceModel);

              $scope.referenceModel.one().get().then(function (data) {
                $scope.item_list = data.objects;
              });
            }

            else if ($scope.type == 'select-multiple-reference') {
              $scope.referenceModel = $injector.get($scope.referenceModel);

              $scope.referenceModel.one().get().then(function (data) {
                $scope.item_list = data.objects;
              });
            }

            else if ($scope.type == 'image-set') {

                $scope.model.image_set = {all: []};
                $scope.nameItem = $scope.name.replace('_set', '');

                $scope.$watch('model', function (newValue, oldValue) {
                    updateImageList();
                });

                var updateImageList = function () {
                    $scope.numImageFiles = $scope.model.image_set.all.length;
                    $scope.imageList = []
                    $scope.model.image_set.deleteImageSet = [];

                    for (var i = 0; i < $scope.maxUploads; i++) {
                        var imageData = $scope.model.image_set.all[i];
                        imageData = imageData ? {data: imageData} : null;
                        $scope.imageList.push(imageData);
                    }
                }
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
                }

                $scope.upload = function (files) {

                    if (files && files.length) {

                        if ($scope.numImageFiles + files.length > $scope.maxUploads) {
                            Modal.open('/static/components/modal/upload_limit_modal.html', null, {
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

                            }).success(function (data, status, headers, config) {
                                $scope.form[$scope.name].$dirty = true;
                                $scope.model.image_set.all.push(data);
                                $scope.imageList[config.index]['data'] = data;
                            }).error(function (data, status, headers, config) {
                                if (status == 413) {
                                  // TODO: alert custom message
                                }
                                else {
                                  // TODO: alert default message
                                }
                                $scope.form[$scope.name].$dirty = true;
                                removeImageClient(config.index)

                            });
                        }
                    }
                };



                $scope.removeImage = function (image, index) {

                    $scope.model.image_set.deleteImageSet.push(image);
                    removeImageClient(index);

                };


            }
        }
    }
});
