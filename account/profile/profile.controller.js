'use strict';

angular.module('odmbase')
  .controller('ProfileCtrl', ['$scope', 'User', 'Auth', '$upload', '$timeout', function ($scope, User, Auth, $upload, $timeout) {

    var image;
    var removeImage = false;

    var updateCurrentUser = function (model) {
          var user = User.one();
          _.extend(user, model);

          Auth.setCurrentUser(user);
          Auth.isLoggedInAsync(function(loggedIn) {
            $scope.submitted = false;
            swal("บันทึกข้อมูลแล้ว")
          });
    };

    $scope.user = User.one().me().then(function(model) {
      $scope.user = model;
    })
    $scope.close = function () {
      $close(result)
    }
    $scope.errors = {};
    $scope.success = {}


    $scope.changeProfile = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        var param = {
          first_name: $scope.user.first_name,
          last_name: $scope.user.last_name,
          address: $scope.user.address,
          description: $scope.user.description,
          phone: $scope.user.phone,
          // Bank account
          bank_number: $scope.user.bank_number,
          bank_name: $scope.user.bank_name,
          bank_user_name: $scope.user.bank_user_name,
          bank_branch: $scope.user.bank_branch,
        }
        if (removeImage) {
            param.image = $scope.user.image;
        }

        var data_encoded = $.param(param);

        $scope.user.customPUT(
            data_encoded, 
            undefined,
            undefined,
            {'Content-Type': "application/x-www-form-urlencoded"}
        ).then(function (model) {

          if (image) {
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
            // form[field].$setValidity('mongoose', false);
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
      $scope.user.imageDataUrl = '';
      $scope.user.image = '';
      removeImage = true;
    }

  }]);
