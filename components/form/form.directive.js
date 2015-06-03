'use strict';

angular
    .module('odmbase')
    .directive('field', CommonField);

function convertImgToBase64URL(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'), dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    try {
        return new Blob([ab], {type: mimeString});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(ab);
        return bb.getBlob(mimeString);
    }
}

function CommonField () {
    return {
        restrict: 'A',
        templateUrl: '/static/app/odmbase/components/form/templates/fields/base.html',
        scope: {
            model: '=',
            form: '=',
            errors: '=',
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
            tagsLoad: '=?',
            onTagAdded: '=?',
            tagsDisplayProperty: '@',
            dateFormat: '@',
            datepickerSelectPastDay: '=?',
            disabled: '='
        },
        // TODO: split one file per one field type T_T
        controller: function($scope, $element, $injector, $upload, $q, $timeout, $http, $rootScope, Modal, textAngularManager, Model, Image) {

            // simple lib include
            $scope.Math = window.Math;
            $scope.moment = window.moment;
            $scope.randnum = _.random(0, 10000);

            if ($scope.referenceModel) {
                $scope.referenceModel = $injector.get($scope.referenceModel);
            }

            $scope.$watch('model.' + $scope.name, function (newValue, oldValue) {
                if (newValue != oldValue && $scope.form[$scope.name] && $scope.form[$scope.name].$invalid) {
                    $scope.form[$scope.name].$setValidity('mongoose', true);
                }
            });

            if ($scope.type == 'text-angular') {
                // Holy bug of text-angular
               $scope.model[$scope.name] = $scope.model[$scope.name] || "";
            }

            else if ($scope.type == 'text-angular-inline') {
                // Holy bug of text-angular
               $scope.model[$scope.name] = $scope.model[$scope.name] || "";
               $scope.handlePaste = function ($html) {

                   //var pastedData = event.originalEvent.clipboardData;
                   $html = $.htmlClean($html, {allowedTags: ["br"]});
                   return $html;

               }
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
                $scope.checkboxMultipleRequired = function () {
                    return $scope.required && (_.filter($scope.model[$scope.name].allDict).length == 0);
                };

                $scope.selectItem = function (item) {
                    updateSelectedList();

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

            else if ($scope.type == 'select-list' || $scope.type == 'select-list-reference' || $scope.type == 'radio-list-reference') {

                var initialData = $scope.model[$scope.name];
                if (initialData && $scope.type == 'select-list') {
                    var filterParam = {};
                    filterParam[$scope.itemKey] = initialData;
                    $scope.selectedItem = _.find($scope.itemList, filterParam);
                }

                if ($scope.type == 'select-list-reference' || $scope.type == 'radio-list-reference') {
                    $scope.referenceModel.one().get($scope.params).then(function (data) {
                        $scope.itemList = data.objects;

                        if (initialData) {
                            var filterParam = {};
                            filterParam[$scope.itemKey] = initialData;
                            $scope.selectedItem = _.find($scope.itemList, filterParam);
                        }

                        if ($scope.model[$scope.name]) {
                            $scope.selectedItem = $scope.model[$scope.name];
                        }
                    });
                }

                $scope.$watch('model.' + $scope.name, function (newValue, oldValue) {
                    if (newValue == undefined && newValue == oldValue) {
                        $scope.selectedItem = null;
                    } else if (newValue != undefined && newValue != oldValue) {
                        if ($scope.type == 'select-list') {
                            var filterParam = {};
                            filterParam[$scope.itemKey] = newValue;
                            $scope.selectedItem = _.find($scope.itemList, filterParam);
                        }
                    } else if (newValue == undefined && newValue != oldValue) {
                        $scope.selectedItem = null;
                    }
                });

                $scope.$watch('itemList', function (newValue, oldValue) {
                    if (newValue != undefined && newValue != oldValue) {
                        if ($scope.model[$scope.name] && $scope.type == 'select-list') {
                            var filterParam = {};
                            filterParam[$scope.itemKey] = $scope.model[$scope.name];
                            $scope.selectedItem = _.find($scope.itemList, filterParam);
                        }
                    }
                });

                $scope.selectSingleItem = function (item) {
                    $scope.selectedItem = item;
                    $scope.model[$scope.name] = item[$scope.itemKey];
                };

            }

            else if ($scope.type == 'image-set') {

                //$scope.maxUploads = $scope.maxUploads || 9999999;

                $scope.min = 0;

                if ($scope.model[$scope.name] && !$scope.model[$scope.name].all) {
                    $scope.model[$scope.name].all = [];
                }

                $scope.nameItem = $scope.name.replace('_set', '');

                $scope.$watch('model.' + $scope.name + '.all.length', function (newValue, oldValue) {
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
                    $scope.numImageFilesModel = $scope.model[$scope.name].all.length;
                    if ($scope.model[$scope.name].all.length == 0) {
                        delete $scope.numImageFilesModel;
                    }

                    if ($scope.model[$scope.name] && !$scope.model[$scope.name].deleteImageSet) {
                        $scope.model[$scope.name].deleteImageSet = [];
                    }

                    // force upload image from external site
                    angular.forEach(_.cloneDeep($scope.model[$scope.name].all), function(imageData, index) {
                        if (imageData.forceUpload && !imageData.id) {
                            imageData.forceUpload = false;

                            $scope.model[$scope.name].all.splice(index, 1);
                            convertImgToBase64URL(imageData.image, function (base64Img) {
                                var blob = dataURItoBlob(base64Img);
                                $scope.upload([blob]);

                            });

                        }
                    });

                    $scope.imageList = [];


                    if ($scope.maxUploads) {
                        for (var i = 0; i < $scope.maxUploads; i++) {
                            var imageData = $scope.model[$scope.name].all[i];
                            imageData = imageData ? {data: imageData} : null;
                            $scope.imageList.push(imageData);
                        }
                    }
                    else {
                        angular.forEach($scope.model[$scope.name].all, function(imageData, key) {
                            $scope.imageList.push({data: imageData});
                            //a.splice(a.length-1, 0, 'z')
                        });
                        $scope.imageList.push(null);
                    }
                };

                var removeImageClient = function (index) {

                    if ($scope.form[$scope.name]) {
                        $scope.form[$scope.name].$dirty = true;
                    }

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
                    }
                };

                $scope.removeImage = function (image, index) {

                    $scope.model[$scope.name].deleteImageSet.push(image);
                    console.log($scope.model[$scope.name].deleteImageSet);
                    removeImageClient(index);

                };

            }

            else if ($scope.type == 'datepicker') {
                $scope.beforeRenderDatepicker = function ($view, $dates, $leftDate, $upDate, $rightDate) {

                    if (!$scope.datepickerSelectPastDay) {
                        var today = new Date();
                        today = today.setHours(0);
                        _.each($dates, function (date) {
                            date.selectable = (date.utcDateValue >= today);
                        });
                    }
                };
            }

        }
    }
}
