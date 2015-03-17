'use strict';

angular.module('odmbase', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngTouch',
  'angular-loading-bar', 
  'ngAnimate',
  'textAngular',
  'monospaced.elastic',
  'restangular',
  'ui.gravatar',
  'ui.slider',
  'LocalStorageModule',
  'ngCart',
  'ngCart.directives',
  'angularFileUpload',
  'angular-ellipses',
  'facebook'

])


  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$resourceProvider', 'RestangularProvider', '$provide', 'localStorageServiceProvider', 'FacebookProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $resourceProvider, RestangularProvider, $provide, localStorageServiceProvider, FacebookProvider) {
    var apiVersion = '/api/v1';
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $resourceProvider.defaults.stripTrailingSlashes = false;

  localStorageServiceProvider.setNotify(true, true);

    RestangularProvider.configuration.requestSuffix = '/';
    RestangularProvider.configuration.suffix = '/';
    RestangularProvider.setBaseUrl(apiVersion);

    FacebookProvider.init(FACEBOOK_APP_ID);
    FacebookProvider.setInitCustomOption('scope', 'email,user_friends');


    $provide.decorator('taOptions', ['$delegate', function(taOptions){
        // $delegate is the taOptions we are decorating
        // here we override the default toolbars and classes specified in taOptions.
        taOptions.toolbar = [
            ['bold', 'italics', 'ul', 'ol', 'quote'],
            // ['justifyLeft','justifyCenter','justifyRight'],
            ['insertLink', 'insertVideo']
        ];
        taOptions.classes = {
            focussed: 'focussed',
            toolbar: 'btn-toolbar',
            toolbarGroup: 'btn-group',
            toolbarButton: 'btn btn-default',
            toolbarButtonActive: 'active',
            disabled: 'disabled',
            textEditor: 'form-control',
            htmlEditor: 'form-control'
        };
        return taOptions; // whatever you return will be the taOptions
    }]);
  }])
  .factory('authInterceptor', ['$rootScope', '$q', '$cookieStore', '$location', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization key to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('key')) {
          config.headers.Authorization = 'ApiKey ' + $cookieStore.get('key');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale keys
          $cookieStore.remove('key');
          return $q.reject(response);
        }
        else if(response.status === 404) {
          window.location = '/404';
          return $q.reject(response);
        }
        else if (response.status === 500) {
          window.location = '/500';
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }])

  .run(['$rootScope', '$location', 'Auth', 'Modal', function ($rootScope, $location, Auth, Modal) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
          Modal.open('/static/app/odmbase/account/modal/login_modal.html', 'LoginCtrl');
        }
      });
    });
  }]);
