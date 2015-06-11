'use strict';

angular
    .module('odmbase')
    .factory('ProfileForm', ['$rootScope', 'User', 'Auth', '$upload', '$timeout', '$location', '$window', '$translate', ProfileForm]);


function ProfileForm($scope, User, Auth, $upload, $timeout, $location, $window, $translate) {

    $scope.redirectPath = '/me';

    var next = $location.search().next;
    var swalTitle;
    var confirmButtonText;

    function updateTranslate() {
        $translate('GLOBAL.SWAL_SAVED_TITLE').then(function (translation) {
            swalTitle = translation;
        });
        $translate('ACCOUNT.PROFILE.SWAL_SAVED_CONFIRM_BUTTON_TEXT').then(function (translation) {
            confirmButtonText = translation;
        });
    }
    updateTranslate();

    $scope.$on('$translateChangeSuccess', function () {
        updateTranslate();
    });

    var ProfileForm = {
        extraFields: [],
        beforeLoad: function () {
            //implement me
        },
        afterLoad: function () {
            //implement me
        },
        beforeSave: function () {
            //implement me
        },
        afterSave: function () {
            //implement me
        },
        afterConfirm: null,
        defaultAfterConfirm: function () {
            swal({
                title: swalTitle,
                confirmButtonText: confirmButtonText
            }, function (isConfirm) {
                if (isConfirm) {
                    $timeout(function () {
                        $location.path($scope.redirectPath);
                    }, 1);
                }

            });
        }
    };

    var image;
    var removeImage = false;

    var updateCurrentUser = function (model) {
        var user = User.one();
        _.extend(user, model);


        ProfileForm.afterSave($scope);


        Auth.setCurrentUser(user);
        Auth.isLoggedInAsync(function(loggedIn) {
          $scope.submitted = false;

          if (next) {
              $location.path(next).search({next: null});
          }
          else if (ProfileForm.afterConfirm) {
              ProfileForm.afterConfirm();
          }
          else {
              ProfileForm.defaultAfterConfirm();
          }

        });
    };

    ProfileForm.beforeLoad($scope);
    $scope.user = User.one().me().then(function(model) {
        $scope.user = model;
        delete($scope.user.password);
        if ($scope.user.email.indexOf('unknow') == 0) {
            $scope.user.email = '';
        }
        ProfileForm.afterLoad($scope);
    })

    $scope.close = function () {
        $close(result)
    }
    $scope.errors = {};
    $scope.success = {}

    $scope.$watch('user.email', function (newValue, oldValue) {

            $scope.errors['email'] = [];

    });

    $scope.changeProfile = function(form) {
        $scope.form = form;
        $scope.submitted = true;

        if(form.$valid) {
            var param = {
                email: $scope.user.email,
                first_name: $scope.user.first_name,
                last_name: $scope.user.last_name,
                password: $scope.user.password

            };

            angular.forEach(ProfileForm.extraFields, function(fieldName) {
                param[fieldName] = $scope.user[fieldName];
            });

            if (removeImage) {
                param.image = $scope.user.image;
            }

            ProfileForm.beforeSave($scope);

            var data_encoded = $.param(param);


            $scope.user.customPUT(
                data_encoded,
                undefined,
                undefined,
                {'Content-Type': "application/x-www-form-urlencoded"}
            ).then(function (model) {

                if (!removeImage && image) {
                    $upload.upload({
                        url: '/api/v1/user/' + $scope.user.id +'/set_image/',
                        file: image,
                        fileFormDataName: 'image'
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (model, status, headers, config) {
                        // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        updateCurrentUser(model);
                    });
                }
                else {
                    updateCurrentUser(model);
                }


            }, function (err) {

                angular.forEach(err.data.error, function(message, field) {
                    //form[field].$setValidity('mongoose', false);
                    $scope.errors[field] = message;
                });
            });
        }
    };

    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

    var generateThumb = function(file, callback) {
        callback = callback || angular.noop;
        if (file != null) {
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function() {

                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            file.dataUrl = e.target.result;
                            callback(file);
                        });
                    }
                });
            }
        }
    }

    $scope.attachImage = function (files) {
        removeImage = false;
        if (files && files.length) {
            image = files[0];
            generateThumb(image, function (image) {
                $scope.user.imageDataUrl = image.dataUrl;
            });

        }
        else {
            image = null;
            $scope.user.imageDataUrl = null;
        }
    };

    $scope.removeImage = function () {
        $scope.user.imageDataUrl = null;
        $scope.user.image = null;
        $scope.user.get_image = null;
        removeImage = true;
    };

    Auth.$scope = $scope;
    $scope.socialSign = Auth.socialSign;

    return ProfileForm;

}