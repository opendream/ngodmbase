'use strict';

angular.module('odmbase')
  .factory('Modal', ['$modal', '$modalStack', function ($modal, $modalStack) {

  var modal = {};
  modal.open = function (templateUrl, size, paramReturn) {

    $modalStack.dismissAll();

    var param = function () { return paramReturn; };

    var modalInstance = $modal.open({
      templateUrl: templateUrl,
      controller: 'ModalInstanceCtrl',
      size: size,
      windowClass: 'odm-modal',
      resolve: {param: param}
    });

    $('#content-wrapper').addClass('blur');
    $('#overlay').show();
    modalInstance.result.then(function (result) {

    }, function (result) {
      $('#content-wrapper').removeClass('blur');
      $('#overlay').hide();
    });

  };

  return modal;
}]);

angular.module('odmbase').controller('ModalInstanceCtrl', function ($scope, $modalInstance, param) {
  $scope.param = param || {};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
