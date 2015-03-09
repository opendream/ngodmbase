'use strict';

angular.module('punjai')
  .controller('NavbarCtrl', ['$scope', '$location', 'Auth', 'ngCart', 'Modal', function ($scope, $location, Auth, ngCart, Modal) {

    $scope.modal = Modal;
    $scope.cart = ngCart;
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
       

  }]);
